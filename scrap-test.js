const { chromium, firefox, webkit, errors: PlaywrightErrors } = require('playwright');


// const { runScraping, ERROR_CODES } = require('./scrap-test');

// (async () => {
//   const oper = [
//     { id: '1', type: 'goto', params: { url: 'https://example.com' } },
//     { id: '2', type: 'waitForSelector', target: { selector: 'h1' } },
//     { id: '3', type: 'getText', target: { selector: 'h1' }, outputKey: 'title' },
//     { id: '4', type: 'screenshot', params: { fullPage: true, path: 'shot.png' } }
//   ];
//   const options = { headless: true, defaultTimeoutMs: 15000, variables: {} };

//   const res = await runScraping(oper, options);
//   console.log(JSON.stringify(res, null, 2));
// })();

// Error codes catalog
const ERROR_CODES = {
  TIMEOUT: 'E_TIMEOUT',
  NOT_FOUND: 'E_NOT_FOUND',
  NAVIGATION: 'E_NAVIGATION',
  INTERACTION: 'E_INTERACTION',
  ASSERTION: 'E_ASSERTION',
  EXTRACTION: 'E_EXTRACTION',
  UPLOAD: 'E_UPLOAD',
  PAGE: 'E_PAGE',
  EVAL: 'E_EVAL',
  UNKNOWN: 'E_UNKNOWN'
};

function nowIso() {
  return new Date().toISOString();
}

function hrtimeMs(start) {
  const diff = process.hrtime(start);
  return Math.round((diff[0] * 1e9 + diff[1]) / 1e6);
}

function deepClone(obj) {
  return obj == null ? obj : JSON.parse(JSON.stringify(obj));
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function templateReplace(str, scopes) {
  if (typeof str !== 'string') return str;
  return str.replace(/\{\{\s*([\w.$\-\[\]]+)\s*\}\}/g, (_m, keyPath) => {
    for (const scope of scopes) {
      const value = getByPath(scope, keyPath);
      if (value !== undefined && value !== null) return String(value);
    }
    return '';
  });
}

function getByPath(obj, path) {
  try {
    const parts = String(path).replace(/\[(\d+)\]/g, '.$1').split('.');
    let cur = obj;
    for (const part of parts) {
      if (!cur || !(part in cur)) return undefined;
      cur = cur[part];
    }
    return cur;
  } catch (_e) {
    return undefined;
  }
}

function applyTemplatesRecursively(input, scopes) {
  if (input == null) return input;
  if (typeof input === 'string') return templateReplace(input, scopes);
  if (Array.isArray(input)) return input.map(v => applyTemplatesRecursively(v, scopes));
  if (isObject(input)) {
    const out = {};
    for (const [k, v] of Object.entries(input)) {
      out[k] = applyTemplatesRecursively(v, scopes);
    }
    return out;
  }
  return input;
}

function classifyError(opType, error) {
  const message = error?.message || String(error);
  if (error instanceof PlaywrightErrors.TimeoutError || /Timeout/i.test(message)) {
    return { code: ERROR_CODES.TIMEOUT, message };
  }
  if (/No node found for selector|waiting for selector .* failed|not found/i.test(message)) {
    return { code: ERROR_CODES.NOT_FOUND, message };
  }
  if (/Navigation .* failed|net::ERR|frame.*detached/i.test(message)) {
    return { code: ERROR_CODES.NAVIGATION, message };
  }
  if (/setInputFiles|upload/i.test(message)) {
    return { code: ERROR_CODES.UPLOAD, message };
  }
  if (/assert|expect|validation/i.test(message)) {
    return { code: ERROR_CODES.ASSERTION, message };
  }
  if (/evaluate|JSHandle/i.test(message)) {
    return { code: ERROR_CODES.EVAL, message };
  }
  // Fallbacks by operation family
  if ([
    'click', 'fill', 'select', 'check', 'uncheck', 'radio', 'press', 'hover', 'dragAndDrop',
    'upload'
  ].includes(opType)) {
    return { code: ERROR_CODES.INTERACTION, message };
  }
  if ([
    'getText', 'getHTML', 'getLinks', 'getImages', 'getTable', 'screenshot'
  ].includes(opType)) {
    return { code: ERROR_CODES.EXTRACTION, message };
  }
  if ([
    'openNewPage', 'switchPage', 'closePage'
  ].includes(opType)) {
    return { code: ERROR_CODES.PAGE, message };
  }
  return { code: ERROR_CODES.UNKNOWN, message };
}

async function getLocator(page, target) {
  if (!target) return null;
  const selectorType = target.selectorType || 'css';
  const selector = target.selector || '';
  const hasText = target.hasText;
  const role = target.role;
  const name = target.name;
  const exact = target.exact === true;

  if (selectorType === 'xpath') {
    return page.locator(`xpath=${selector}`);
  }
  if (selectorType === 'text') {
    return page.getByText(selector, { exact });
  }
  if (selectorType === 'role' && role) {
    return page.getByRole(role, name ? { name, exact } : undefined);
  }
  // default css
  const locator = page.locator(selector);
  return hasText ? locator.filter({ hasText }) : locator;
}

async function ensureWait(page, waitFor, timeoutMs) {
  if (!waitFor) return;
  const state = waitFor.state;
  const selector = waitFor.selector;
  const waitTimeout = waitFor.timeoutMs || timeoutMs;
  if (selector) {
    await page.waitForSelector(selector, { state: state || 'visible', timeout: waitTimeout });
    return;
  }
  if (state) {
    await page.waitForLoadState(state, { timeout: waitTimeout });
  }
}

async function handleOperation(ctx, op) {
  const { pages, getPage, setCurrentPage, options, context, logs } = ctx;
  const attemptsMax = Math.max(0, Number(op.retry || 0)) + 1;
  const timeoutMs = op.timeoutMs || options.defaultTimeoutMs;
  const opType = op.type;
  let attempt = 0;
  const startedAt = nowIso();
  const stepStart = process.hrtime();
  let pageIndexUsed = null;
  let output = undefined;
  let artifacts = {};

  // Resolve which page to use
  async function resolvePage() {
    if (op.page === 'new') {
      const page = await ctx.browser.newPage();
      await page.setViewportSize(options.viewport);
      pages.push(page);
      setCurrentPage(pages.length - 1);
      return { page, index: pages.length - 1 };
    }
    if (typeof op.page === 'number') {
      const idx = op.page;
      if (!pages[idx]) throw new Error(`Page index ${idx} not available`);
      setCurrentPage(idx);
      return { page: pages[idx], index: idx };
    }
    // default current
    return { page: getPage(), index: ctx.currentPageIndex };
  }

  // Execute with retries
  while (attempt < attemptsMax) {
    attempt += 1;
    try {
      const { page, index } = await resolvePage();
      pageIndexUsed = index;

      // Pre-wait if requested
      if (op.waitFor) {
        await ensureWait(page, op.waitFor, timeoutMs);
      }

      const opWithTemplates = applyTemplatesRecursively(
        deepClone(op),
        [op.inject || {}, options.variables || {}, context]
      );

      const targetLocator = await getLocator(page, opWithTemplates.target);
      const params = opWithTemplates.params || {};

      switch (opType) {
        // Navegación y movimiento
        case 'goto': {
          const url = params.url || '';
          await page.goto(url, { timeout: timeoutMs, waitUntil: 'load' });
          break;
        }
        case 'back': {
          await page.goBack({ timeout: timeoutMs, waitUntil: 'load' });
          break;
        }
        case 'reload': {
          await page.reload({ timeout: timeoutMs, waitUntil: 'load' });
          break;
        }
        case 'scroll': {
          const x = Number(params.x || 0);
          const y = Number(params.y || 0);
          const behavior = params.behavior || 'auto';
          if (targetLocator) {
            await targetLocator.evaluate((el, by) => {
              el.scrollBy({ left: by.x, top: by.y, behavior: by.behavior });
            }, { x, y, behavior });
          } else {
            await page.evaluate(({ x, y, behavior }) => {
              window.scrollBy({ left: x, top: y, behavior });
            }, { x, y, behavior });
          }
          break;
        }
        case 'zoom': {
          const scale = Number(params.scale || 1);
          await page.evaluate(s => { document.body.style.zoom = String(s); }, scale);
          break;
        }
        case 'hover': {
          if (!targetLocator) throw new Error('Target required for hover');
          await targetLocator.hover({ timeout: timeoutMs });
          break;
        }
        case 'dragAndDrop': {
          const toTarget = params.toTarget;
          if (!targetLocator) throw new Error('Target (from) required for dragAndDrop');
          if (!toTarget) throw new Error('params.toTarget is required for dragAndDrop');
          const toLocator = await getLocator(page, toTarget);
          await targetLocator.dragTo(toLocator, { timeout: timeoutMs });
          break;
        }
        case 'openNewPage': {
          const newPage = await ctx.browser.newPage();
          await newPage.setViewportSize(options.viewport);
          pages.push(newPage);
          setCurrentPage(pages.length - 1);
          output = { pageIndex: pages.length - 1 };
          break;
        }
        case 'switchPage': {
          const idx = Number(params.pageIndex);
          if (!Number.isInteger(idx) || !pages[idx]) throw new Error(`Page index ${idx} not available`);
          setCurrentPage(idx);
          output = { pageIndex: idx };
          break;
        }
        case 'closePage': {
          const idx = typeof op.page === 'number' ? op.page : ctx.currentPageIndex;
          if (!pages[idx]) throw new Error(`Page index ${idx} not available`);
          await pages[idx].close();
          pages.splice(idx, 1);
          const newIndex = Math.max(0, Math.min(idx, pages.length - 1));
          setCurrentPage(newIndex);
          output = { newCurrentPageIndex: newIndex };
          break;
        }

        // Interacción con elementos
        case 'click': {
          if (!targetLocator) throw new Error('Target required for click');
          await targetLocator.click({ timeout: timeoutMs });
          break;
        }
        case 'fill': {
          if (!targetLocator) throw new Error('Target required for fill');
          await targetLocator.fill(String(params.value ?? ''), { timeout: timeoutMs });
          break;
        }
        case 'press': {
          const key = params.keyCombo || params.key || 'Enter';
          if (targetLocator) {
            await targetLocator.press(key, { timeout: timeoutMs });
          } else {
            await page.keyboard.press(key);
          }
          break;
        }
        case 'select': {
          if (!targetLocator) throw new Error('Target required for select');
          const option = params.value ?? (params.label ? { label: params.label } : (params.index != null ? { index: Number(params.index) } : undefined));
          if (option === undefined) throw new Error('params.value/label/index required for select');
          await targetLocator.selectOption(option, { timeout: timeoutMs });
          break;
        }
        case 'check': {
          if (!targetLocator) throw new Error('Target required for check');
          await targetLocator.check({ timeout: timeoutMs });
          break;
        }
        case 'uncheck': {
          if (!targetLocator) throw new Error('Target required for uncheck');
          await targetLocator.uncheck({ timeout: timeoutMs });
          break;
        }
        case 'radio': {
          if (params.value != null && opWithTemplates.target && opWithTemplates.target.selector) {
            const sel = `${opWithTemplates.target.selector} input[type="radio"][value="${params.value}"]`;
            await page.locator(sel).check({ timeout: timeoutMs });
          } else if (targetLocator) {
            await targetLocator.check({ timeout: timeoutMs });
          } else {
            throw new Error('Target or value required for radio');
          }
          break;
        }
        case 'upload': {
          if (!targetLocator) throw new Error('Target required for upload');
          if (!params.filePath) throw new Error('params.filePath required for upload');
          await targetLocator.setInputFiles(params.filePath, { timeout: timeoutMs });
          break;
        }

        // Esperas y validaciones
        case 'waitForSelector': {
          if (!opWithTemplates.target || !opWithTemplates.target.selector) throw new Error('target.selector required for waitForSelector');
          const state = params.state || 'visible';
          await page.waitForSelector(opWithTemplates.target.selector, { state, timeout: timeoutMs });
          break;
        }
        case 'waitForTimeout': {
          const ms = Number(params.ms || 1000);
          await page.waitForTimeout(ms);
          break;
        }
        case 'waitForLoadState': {
          const state = params.state || 'load';
          await page.waitForLoadState(state, { timeout: timeoutMs });
          break;
        }
        case 'assertText': {
          if (!targetLocator) throw new Error('Target required for assertText');
          const text = await targetLocator.innerText({ timeout: timeoutMs });
          if (params.equals != null && text !== String(params.equals)) {
            throw new Error(`Assertion failed: text !== equals ("${text}" !== "${params.equals}")`);
          }
          if (params.includes != null && !text.includes(String(params.includes))) {
            throw new Error(`Assertion failed: text does not include "${params.includes}"`);
          }
          if (params.regex != null) {
            const re = new RegExp(params.regex);
            if (!re.test(text)) throw new Error(`Assertion failed: text does not match /${params.regex}/`);
          }
          output = { text };
          break;
        }
        case 'assertElement': {
          const state = params.state || 'visible';
          if (!opWithTemplates.target || !opWithTemplates.target.selector) throw new Error('target.selector required for assertElement');
          await page.waitForSelector(opWithTemplates.target.selector, { state, timeout: timeoutMs });
          break;
        }

        // Extracción y procesamiento
        case 'getText': {
          if (!targetLocator) throw new Error('Target required for getText');
          output = await targetLocator.innerText({ timeout: timeoutMs });
          break;
        }
        case 'getHTML': {
          if (targetLocator) {
            output = await targetLocator.innerHTML({ timeout: timeoutMs });
          } else {
            output = await page.content();
          }
          break;
        }
        case 'getLinks': {
          if (targetLocator) {
            output = await targetLocator.locator('a').evaluateAll(els => els.map(a => a.href).filter(Boolean));
          } else {
            output = await page.locator('a').evaluateAll(els => els.map(a => a.href).filter(Boolean));
          }
          break;
        }
        case 'getImages': {
          if (targetLocator) {
            output = await targetLocator.locator('img').evaluateAll(els => els.map(i => i.src).filter(Boolean));
          } else {
            output = await page.locator('img').evaluateAll(els => els.map(i => i.src).filter(Boolean));
          }
          break;
        }
        case 'getTable': {
          if (!targetLocator) throw new Error('Target required for getTable');
          output = await targetLocator.evaluate((table) => {
            const rows = Array.from(table.querySelectorAll('tr'));
            return rows.map(row => Array.from(row.querySelectorAll('th,td')).map(cell => cell.innerText.trim()));
          });
          break;
        }
        case 'screenshot': {
          const fullPage = Boolean(params.fullPage);
          const path = params.path;
          if (targetLocator) {
            output = await targetLocator.screenshot({ path, timeout: timeoutMs });
          } else {
            output = await page.screenshot({ fullPage, path, timeout: timeoutMs });
          }
          artifacts.screenshotPath = path || null;
          break;
        }

        default:
          throw new Error(`Unsupported operation type: ${opType}`);
      }

      // Save output into context if requested
      if (opWithTemplates.outputKey) {
        context[opWithTemplates.outputKey] = output;
      }

      const durationMs = hrtimeMs(stepStart);
      logs.push({ level: 'info', opId: op.id, type: opType, msg: 'ok', t: nowIso() });
      return {
        id: op.id,
        type: opType,
        success: true,
        errorCode: null,
        errorMessage: null,
        startedAt,
        endedAt: nowIso(),
        durationMs,
        timeoutMs,
        attempts: attempt,
        pageIndex: pageIndexUsed,
        output,
        artifacts
      };
    } catch (err) {
      const { code, message } = classifyError(opType, err);

      if (attempt < attemptsMax) {
        // retry loop continues
      } else {
        const durationMs = hrtimeMs(stepStart);
        if (options.traceOnError) {
          try {
            const current = ctx.currentPageIndex;
            if (ctx.pages[current]) {
              const p = ctx.pages[current];
              await p.screenshot({ path: params?.errorScreenshotPath || undefined, fullPage: true }).catch(() => {});
            }
          } catch (_e) {
            // ignore
          }
        }
        logs.push({ level: 'error', opId: op.id, type: opType, msg: message, code, t: nowIso() });
        const result = {
          id: op.id,
          type: opType,
          success: false,
          errorCode: code,
          errorMessage: message,
          startedAt,
          endedAt: nowIso(),
          durationMs,
          timeoutMs,
          attempts: attempt,
          pageIndex: pageIndexUsed,
          output: undefined,
          artifacts
        };
        if (op.continueOnError) return result;
        throw Object.assign(new Error(message), { stepResult: result });
      }
    }
  }
}

async function runScraping(oper, options = {}) {
  const startedAt = nowIso();
  const runStart = process.hrtime();

  const resolvedOptions = {
    browser: options.browser || 'chromium',
    headless: options.headless !== false,
    viewport: options.viewport || { width: 1920, height: 1080 },
    storageState: options.storageState,
    baseURL: options.baseURL,
    defaultTimeoutMs: options.defaultTimeoutMs || 30000,
    traceOnError: options.traceOnError !== false,
    maxConcurrentPages: options.maxConcurrentPages || 5,
    variables: options.variables || {},
    launchArgs: options.launchArgs || [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  };

  const context = Object.assign({}, resolvedOptions.variables);
  const logs = [];
  const results = [];
  let browser = null;
  let pages = [];
  let currentPageIndex = 0;

  function getPage() {
    return pages[currentPageIndex];
  }

  function setCurrentPage(idx) {
    currentPageIndex = idx;
  }

  try {
    const engine = resolvedOptions.browser === 'firefox' ? firefox : (resolvedOptions.browser === 'webkit' ? webkit : chromium);
    browser = await engine.launch({ headless: resolvedOptions.headless, args: resolvedOptions.launchArgs });

    const firstPage = await browser.newPage({ storageState: resolvedOptions.storageState });
    await firstPage.setViewportSize(resolvedOptions.viewport);
    pages.push(firstPage);
    currentPageIndex = 0;

    // Prepend baseURL to relative goto urls
    const normalizedOps = (oper || []).map(op => {
      if (op && op.type === 'goto' && resolvedOptions.baseURL && op.params && typeof op.params.url === 'string') {
        const u = op.params.url;
        if (!/^https?:\/\//i.test(u)) {
          const base = resolvedOptions.baseURL.endsWith('/') ? resolvedOptions.baseURL.slice(0, -1) : resolvedOptions.baseURL;
          const rel = u.startsWith('/') ? u : `/${u}`;
          return {
            ...op,
            params: { ...op.params, url: `${base}${rel}` }
          };
        }
      }
      return op;
    });

    for (const op of normalizedOps) {
      const ctx = { browser, pages, getPage, setCurrentPage, currentPageIndex, options: resolvedOptions, context, logs };
      try {
        const stepResult = await handleOperation(ctx, op);
        results.push(stepResult);
      } catch (e) {
        if (e && e.stepResult) {
          results.push(e.stepResult);
        } else {
          const { code, message } = classifyError(op?.type || 'unknown', e || new Error('unknown error'));
          results.push({
            id: op?.id,
            type: op?.type,
            success: false,
            errorCode: code,
            errorMessage: message,
            startedAt: nowIso(),
            endedAt: nowIso(),
            durationMs: 0,
            timeoutMs: op?.timeoutMs || resolvedOptions.defaultTimeoutMs,
            attempts: 1,
            pageIndex: currentPageIndex,
            output: undefined,
            artifacts: {}
          });
        }
        if (!op?.continueOnError) break;
      }
    }

    const endedAt = nowIso();
    const durationMs = hrtimeMs(runStart);
    const totals = {
      steps: results.length,
      success: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      timeouts: results.filter(r => r.errorCode === ERROR_CODES.TIMEOUT).length
    };
    const success = totals.failed === 0;

    return { success, timeouts: totals.timeouts, totals, results, log: logs, context, startedAt, endedAt, durationMs };
  } finally {
    try {
      // Close all pages and browser
      await Promise.allSettled(pages.map(p => p.close().catch(() => {})));
    } catch (_e) {}
    try { if (browser) await browser.close(); } catch (_e) {}
  }
}

module.exports = {
  runScraping,
  ERROR_CODES
};



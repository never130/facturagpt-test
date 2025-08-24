const axios = require("axios");
const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

const { sendTextData } = require("../processChat.js");
const { assistantAgent } = require("../automate/utils.js");
const { connectDB } = require("../../controllers/utils");

const sharp = require('sharp');

const saveTemplate = async (userId, template) => {
    try {
        const dbTemplates = await connectDB(`db_${userId}_templates`);

        if (template._id) {
            const existingTemplate = await dbTemplates.get(template._id);
            template._rev = existingTemplate._rev;
            template.updatedAt = new Date().toISOString();
        } else {
            template.createdAt = new Date().toISOString();
            template.updatedAt = new Date().toISOString();
        }

        const result = await dbTemplates.insert(template);
        return {
            success: true,
            template: { ...template, _id: result.id, _rev: result.rev }
        };
    } catch (error) {
        console.error('Error saving template:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const loadTemplates = async (userId) => {
    try {
        const dbTemplates = await connectDB(`db_${userId}_templates`);
        const result = await dbTemplates.list({ include_docs: true });

        const templates = result.rows
            .map(row => row.doc)
            .filter(doc => doc && doc.type === 'scraping_template')
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        return {
            success: true,
            templates
        };
    } catch (error) {
        console.error('Error loading templates:', error);
        return {
            success: false,
            error: error.message,
            templates: []
        };
    }
};

const loadTemplate = async (userId, templateId) => {
    try {
        const dbTemplates = await connectDB(`db_${userId}_templates`);
        const template = await dbTemplates.get(templateId);

        return {
            success: true,
            template
        };
    } catch (error) {
        console.error('Error loading template:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const deleteTemplate = async (userId, templateId) => {
    try {
        const dbTemplates = await connectDB(`db_${userId}_templates`);
        const template = await dbTemplates.get(templateId);
        await dbTemplates.destroy(templateId, template._rev);

        return {
            success: true
        };
    } catch (error) {
        console.error('Error deleting template:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const executeTemplate = async ({
    res,
    token,
    template,
    userId,
    agentId,
    chatId,
    conf
}) => {
    try {
        await sendTextData({
            res,
            data: {
                text: "🚀 Iniciando ejecución del template de scraping...",
                status: "executing"
            },
            type: 'scraping',
            conf
        });

        const results = [];
        const startTime = Date.now();

        const browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        await page.setViewportSize({ width: 1920, height: 1080 });

        for (let i = 0; i < template.steps.length; i++) {
            const step = template.steps[i];

            await sendTextData({
                res,
                data: {
                    text: `📋 Ejecutando paso ${i + 1}/${template.steps.length}: ${step.name}`,
                    status: "step_progress",
                    currentStep: i + 1,
                    totalSteps: template.steps.length
                },
                type: 'scraping',
                conf
            });

            try {
                const stepResult = await executeStep(page, step, template.selectors);
                results.push({
                    stepId: step.id,
                    stepName: step.name,
                    success: true,
                    result: stepResult,
                    timestamp: new Date().toISOString()
                });
            } catch (stepError) {
                results.push({
                    stepId: step.id,
                    stepName: step.name,
                    success: false,
                    error: stepError.message,
                    timestamp: new Date().toISOString()
                });
            }
        }

        await browser.close();

        const executionTime = (Date.now() - startTime) / 1000;

        const dbChat = await connectDB(`db_${userId}_chat`);
        let chat = await dbChat.get(chatId);

        if (!chat.scrapingResults) {
            chat.scrapingResults = [];
        }

        const executionResult = {
            id: uuidv4(),
            templateId: template.id,
            templateName: template.name,
            results,
            executionTime,
            timestamp: new Date().toISOString()
        };

        chat.scrapingResults.push(executionResult);
        await dbChat.insert(chat);

        await sendTextData({
            res,
            data: {
                text: `✅ Template ejecutado exitosamente en ${executionTime.toFixed(2)}s`,
                results: executionResult,
                status: "completed"
            },
            type: 'scraping-result',
            conf
        });

    } catch (error) {
        console.error('Error executing template:', error);
        await sendTextData({
            res,
            data: {
                text: "❌ Error al ejecutar el template de scraping",
                error: error.message
            },
            type: 'error',
            conf
        });
    }
};

const executeStep = async (page, step, selectors) => {
    switch (step.type) {
        case 'action':
            return await executeAction(page, step, selectors);
        case 'condition':
            return await executeCondition(page, step, selectors);
        case 'loop':
            return await executeLoop(page, step, selectors);
        case 'variable':
            return await executeVariable(page, step, selectors);
        default:
            throw new Error(`Tipo de paso no soportado: ${step.type}`);
    }
};

const executeAction = async (page, step, selectors) => {
    const { action, parameters } = step;

    switch (action) {
        case 'navigate':
            await page.goto(parameters.url, { waitUntil: 'networkidle' });
            return { message: `Navegado a ${parameters.url}` };

        case 'click':
            const selector = selectors.find(s => s.id === parameters.selectorId);
            if (!selector) throw new Error(`Selector no encontrado: ${parameters.selectorId}`);

            await page.click(selector.selector);
            return { message: `Clic en ${selector.name}` };

        case 'extract':
            const extractSelector = selectors.find(s => s.id === parameters.selectorId);
            if (!extractSelector) throw new Error(`Selector no encontrado: ${parameters.selectorId}`);

            const text = await page.textContent(extractSelector.selector);
            return {
                message: `Texto extraído de ${extractSelector.name}`,
                value: text,
                selector: extractSelector.name
            };

        case 'wait':
            await page.waitForTimeout(parameters.duration || 1000);
            return { message: `Esperado ${parameters.duration}ms` };

        case 'waitForElement':
            const waitSelector = selectors.find(s => s.id === parameters.selectorId);
            if (!waitSelector) throw new Error(`Selector no encontrado: ${parameters.selectorId}`);

            await page.waitForSelector(waitSelector.selector, { timeout: parameters.timeout || 10000 });
            return { message: `Elemento ${waitSelector.name} encontrado` };

        case 'type':
            const typeSelector = selectors.find(s => s.id === parameters.selectorId);
            if (!typeSelector) throw new Error(`Selector no encontrado: ${parameters.selectorId}`);

            await page.fill(typeSelector.selector, parameters.text);
            return { message: `Texto escrito en ${typeSelector.name}` };

        default:
            throw new Error(`Acción no soportada: ${action}`);
    }
};

const executeCondition = async (page, step, selectors) => {
    const { condition, parameters } = step;

    switch (condition) {
        case 'elementExists':
            const selector = selectors.find(s => s.id === parameters.selectorId);
            if (!selector) throw new Error(`Selector no encontrado: ${parameters.selectorId}`);

            const exists = await page.$(selector.selector) !== null;
            return {
                message: `Condición verificada: ${selector.name} ${exists ? 'existe' : 'no existe'}`,
                result: exists
            };

        case 'textContains':
            const textSelector = selectors.find(s => s.id === parameters.selectorId);
            if (!textSelector) throw new Error(`Selector no encontrado: ${parameters.selectorId}`);

            const text = await page.textContent(textSelector.selector);
            const contains = text.includes(parameters.text);
            return {
                message: `Condición verificada: ${textSelector.name} ${contains ? 'contiene' : 'no contiene'} "${parameters.text}"`,
                result: contains
            };

        case 'custom':
            const customResult = await evaluateCustomCondition(page, parameters.prompt, selectors);
            return {
                message: `Condición personalizada evaluada`,
                result: customResult
            };

        default:
            throw new Error(`Condición no soportada: ${condition}`);
    }
};

const executeLoop = async (page, step, selectors) => {
    const { loopType, parameters, steps } = step;

    switch (loopType) {
        case 'forEach':
            const selector = selectors.find(s => s.id === parameters.selectorId);
            if (!selector) throw new Error(`Selector no encontrado: ${parameters.selectorId}`);

            const elements = await page.$$(selector.selector);
            const results = [];

            for (let i = 0; i < elements.length; i++) {
                const elementResult = await executeStepsOnElement(page, steps, elements[i], selectors);
                results.push(elementResult);
            }

            return {
                message: `Bucle ejecutado en ${elements.length} elementos`,
                results
            };

        case 'while':
            let iterations = 0;
            const maxIterations = parameters.maxIterations || 100;

            while (iterations < maxIterations) {
                const conditionResult = await executeCondition(page, parameters.condition, selectors);
                if (!conditionResult.result) break;

                await executeStepsOnElement(page, steps, null, selectors);
                iterations++;
            }

            return {
                message: `Bucle while ejecutado ${iterations} veces`,
                iterations
            };

        default:
            throw new Error(`Tipo de bucle no soportado: ${loopType}`);
    }
};

const executeVariable = async (page, step, selectors) => {
    const { variableType, parameters } = step;

    switch (variableType) {
        case 'extract':
            const selector = selectors.find(s => s.id === parameters.selectorId);
            if (!selector) throw new Error(`Selector no encontrado: ${parameters.selectorId}`);

            const value = await page.textContent(selector.selector);
            return {
                message: `Variable extraída: ${parameters.variableName} = "${value}"`,
                variableName: parameters.variableName,
                value
            };

        case 'set':
            return {
                message: `Variable establecida: ${parameters.variableName} = "${parameters.value}"`,
                variableName: parameters.variableName,
                value: parameters.value
            };

        default:
            throw new Error(`Tipo de variable no soportado: ${variableType}`);
    }
};

const executeStepsOnElement = async (page, steps, element, selectors) => {
    const results = [];

    for (const step of steps) {
        try {
            if (element) {
                const result = await executeStepOnElement(element, step, selectors);
                results.push(result);
            } else {
                const result = await executeStep(page, step, selectors);
                results.push(result);
            }
        } catch (error) {
            results.push({
                stepId: step.id,
                success: false,
                error: error.message
            });
        }
    }

    return results;
};

const executeStepOnElement = async (element, step, selectors) => {
    const { action, parameters } = step;

    switch (action) {
        case 'click':
            await element.click();
            return { message: 'Clic en elemento' };

        case 'extract':
            const text = await element.textContent();
            return {
                message: 'Texto extraído del elemento',
                value: text
            };

        case 'type':
            await element.fill(parameters.text);
            return { message: `Texto escrito: "${parameters.text}"` };

        default:
            throw new Error(`Acción no soportada en elemento: ${action}`);
    }
};

const evaluateCustomCondition = async (page, prompt, selectors) => {
    try {
        const pageInfo = await page.evaluate(() => {
            const getComputedStyles = (element) => {
                const styles = window.getComputedStyle(element);
                return {
                    width: styles.width,
                    height: styles.height,
                    position: styles.position,
                    top: styles.top,
                    left: styles.left,
                    backgroundColor: styles.backgroundColor,
                    color: styles.color,
                    fontSize: styles.fontSize,
                    fontFamily: styles.fontFamily,
                    border: styles.border,
                    borderRadius: styles.borderRadius,
                    padding: styles.padding,
                    margin: styles.margin,
                    display: styles.display,
                    visibility: styles.visibility,
                    opacity: styles.opacity,
                    zIndex: styles.zIndex
                };
            };

            const serializeElement = (element) => {
                if (!element) return null;
                
                const rect = element.getBoundingClientRect();
                const styles = getComputedStyles(element);
                
                return {
                    tagName: element.tagName.toLowerCase(),
                    id: element.id || '',
                    className: element.className || '',
                    textContent: element.textContent?.trim().substring(0, 100) || '',
                    href: element.href || '',
                    src: element.src || '',
                    type: element.type || '',
                    value: element.value || '',
                    placeholder: element.placeholder || '',
                    rect: {
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height
                    },
                    styles: styles,
                    isVisible: rect.width > 0 && rect.height > 0 && styles.visibility !== 'hidden' && styles.display !== 'none'
                };
            };

            const interactiveElements = [];
            
            document.querySelectorAll('button, input[type="button"], input[type="submit"], a.btn, .btn').forEach(el => {
                const serialized = serializeElement(el);
                if (serialized && serialized.isVisible) {
                    serialized.elementType = 'button';
                    interactiveElements.push(serialized);
                }
            });

            document.querySelectorAll('a').forEach(el => {
                const serialized = serializeElement(el);
                if (serialized && serialized.isVisible && !el.classList.contains('btn')) {
                    serialized.elementType = 'link';
                    interactiveElements.push(serialized);
                }
            });

            document.querySelectorAll('input, textarea, select').forEach(el => {
                const serialized = serializeElement(el);
                if (serialized && serialized.isVisible) {
                    serialized.elementType = 'input';
                    interactiveElements.push(serialized);
                }
            });

            document.querySelectorAll('img').forEach(el => {
                const serialized = serializeElement(el);
                if (serialized && serialized.isVisible) {
                    serialized.elementType = 'image';
                    interactiveElements.push(serialized);
                }
            });

            const getHTMLWithStyles = () => {
                const clone = document.cloneNode(true);
                
                const addInlineStyles = (element) => {
                    if (element.nodeType === Node.ELEMENT_NODE) {
                        const styles = window.getComputedStyle(element);
                        let inlineStyles = '';
                        
                        const importantProps = [
                            'width', 'height', 'position', 'top', 'left', 'right', 'bottom',
                            'backgroundColor', 'color', 'fontSize', 'fontFamily', 'fontWeight',
                            'border', 'borderRadius', 'padding', 'margin', 'display', 'visibility',
                            'opacity', 'zIndex', 'background', 'textAlign', 'verticalAlign',
                            'flexDirection', 'justifyContent', 'alignItems', 'flexWrap'
                        ];
                        
                        importantProps.forEach(prop => {
                            const value = styles.getPropertyValue(prop);
                            if (value && value !== 'initial' && value !== 'normal') {
                                inlineStyles += `${prop}: ${value}; `;
                            }
                        });
                        
                        if (inlineStyles) {
                            element.setAttribute('style', inlineStyles);
                        }
                        
                        Array.from(element.children).forEach(addInlineStyles);
                    }
                };
                
                addInlineStyles(clone);
                return clone.documentElement.outerHTML;
            };

            return {
                title: document.title,
                description: document.querySelector('meta[name="description"]')?.content || '',
                url: window.location.href,
                elements: {
                    buttons: document.querySelectorAll('button, input[type="button"], input[type="submit"], a.btn').length,
                    forms: document.querySelectorAll('form').length,
                    images: document.querySelectorAll('img').length,
                    links: document.querySelectorAll('a').length
                },
                interactiveElements: interactiveElements,
                htmlWithStyles: getHTMLWithStyles()
            };
        });

        const conditionMet = prompt.toLowerCase().includes('existe') ||
            prompt.toLowerCase().includes('visible') ||
            prompt.toLowerCase().includes('presente');

        return conditionMet;
    } catch (error) {
        console.error('Error evaluating custom condition:', error);
        return false;
    }
};

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const meetScraping = async ({
    res,
    token,
    prompt,
    type,
    conf
}) => {
    try {
        const {
            userId,
            agentId,
            chatId,
            scrapId: _scrapId
        } = conf;

        console.log('conf scraping', conf);


        let scrapId = _scrapId
        const dbChat = await connectDB(`db_${userId}_chat`);
        // let chat = await dbChat.get(chatId);

        let chat = await dbChat.find({
            selector: {
                _id: chatId
            }
        });

        console.log('chat scraping', chat);

        if (chat.docs.length > 0) {
            chat = chat.docs[0];
        } else {
            chat = {}
        }


        if (!chat.state || !chat.data.websiteUrl) {
            chat.state = {
                step: 'initial',
                websiteUrl: null,
                websiteScreenshot: null,
                websitePdf: null,
                userScreenshot: null,
                userText: null,
                matchedComponent: null,
                extractedData: {},
                templates: [],
                currentTemplate: null
            };
            const response = await dbChat.insert(chat);

            scrapId = response.id;
        }

        const currentState = chat.state;

        if (currentState.step === 'initial') {
            const response = await assistantAgent({
                res,
                token,
                prompt,
                agent: {
                    tone: 70,
                    answer: 60,
                    formality: 60,
                    presicion: 80
                },
                userId,
                agentId,
                chatId,
                scrapId,
                action: 'fnMeetScraping',
                data: {
                    websiteUrl: {
                        description: "¿Cuál es la URL de la página web que quieres analizar?",
                        type: "url",
                        required: true
                    }
                }
            });



            if (response.success) {
                switch (response.action) {
                    case 'fnMeetScraping':
                        await performWebScraping({
                            res,
                            token,
                            websiteUrl: response.value,
                            userId,
                            agentId,
                            chatId,
                            conf
                        });
                        break;
                    default:
                        return {
                            success: true,
                            action: response.action
                        }
                        break;
                }
            }


            return;
        }

        if (currentState.websiteUrl && !currentState.websiteScreenshot) {
            await performWebScraping({
                res,
                token,
                websiteUrl: currentState.websiteUrl,
                userId,
                agentId,
                chatId,
                conf
            });
            return;
        }

        if (currentState.websiteScreenshot && !currentState.userScreenshot) {
            const userData = {
                userScreenshot: {
                    description: "Envía una captura de pantalla del elemento o sección que quieres que identifique en la página web",
                    type: "image",
                    required: true
                },
                userText: {
                    description: "Describe qué información o elemento específico estás buscando en la página",
                    type: "text",
                    required: true
                }
            };

            await assistantAgent({
                res,
                token,
                prompt,
                agent: {
                    tone: 60,
                    answer: 70,
                    formality: 50,
                    presicion: 75
                },
                userId,
                agentId,
                chatId,
                scrapId,
                data: userData
            });
            return;
        }

        if (currentState.websiteScreenshot && currentState.userScreenshot && currentState.userText) {
            await compareAndExtract({
                res,
                token,
                websiteScreenshot: currentState.websiteScreenshot,
                userScreenshot: currentState.userScreenshot,
                userText: currentState.userText,
                websiteUrl: currentState.websiteUrl,
                userId,
                agentId,
                chatId,
                conf
            });
            return;
        }

    } catch (error) {
        console.error('Error in meetScraping:', error);
        await sendTextData({
            res,
            data: {
                text: "Lo siento, hubo un error durante el proceso de scraping. Por favor, intenta de nuevo.",
                error: error.message
            },
            type: 'scraping',
            conf: {
                userId: conf.userId,
                agentId: conf.agentId,
                chatId: conf.chatId
            }
        });
    }
};

const ensureHttpProtocol = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return '';
    return /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
};

const getFavicon = async (url) => {
    try {
        const normalizedUrl = ensureHttpProtocol(url);
        const urlObj = new URL(normalizedUrl);
        const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
        
        const faviconUrls = [
            `${baseUrl}/favicon.ico`,
            `${baseUrl}/favicon.png`,
            `${baseUrl}/apple-touch-icon.png`,
            `${baseUrl}/icon.png`
        ];

        for (const faviconUrl of faviconUrls) {
            try {
                const response = await axios.head(faviconUrl, { timeout: 5000 });
                if (response.status === 200) {
                    return faviconUrl;
                }
            } catch (error) {
                continue;
            }
        }

        try {
            const response = await axios.get(normalizedUrl, { timeout: 10000 });
            const html = response.data;
            
            const faviconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["']/i);
            if (faviconMatch) {
                const faviconPath = faviconMatch[1];
                if (faviconPath.startsWith('http')) {
                    return faviconPath;
                } else if (faviconPath.startsWith('/')) {
                    return `${baseUrl}${faviconPath}`;
                } else {
                    return `${baseUrl}/${faviconPath}`;
                }
            }
        } catch (error) {
            console.error('Error extracting favicon from HTML:', error);
        }

        return null;
    } catch (error) {
        console.error('Error getting favicon:', error);
        return null;
    }
};

const createSelectionOverlay = async (page) => {
    await page.addInitScript(() => {
        const overlay = document.createElement('div');
        overlay.id = 'scraping-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 999999;
            pointer-events: none;
            background: transparent;
        `;
        document.body.appendChild(overlay);

        window.scrapingData = {
            selectedElements: [],
            isSelecting: false,
            highlightElement: null
        };

        const generateUniqueSelector = (element) => {
            if (element.id) {
                return `#${element.id}`;
            }
            
            let path = [];
            let current = element;
            
            while (current && current !== document.body) {
                let selector = current.tagName.toLowerCase();
                
                if (current.className) {
                    const classes = current.className.split(' ').filter(c => c.trim());
                    if (classes.length > 0) {
                        selector += '.' + classes.join('.');
                    }
                }
                
                const siblings = Array.from(current.parentNode.children);
                const index = siblings.indexOf(current) + 1;
                if (siblings.length > 1) {
                    selector += `:nth-child(${index})`;
                }
                
                path.unshift(selector);
                current = current.parentNode;
            }
            
            return path.join(' > ');
        };

        const highlightElement = (element) => {
            if (window.scrapingData.highlightElement) {
                window.scrapingData.highlightElement.style.outline = '';
                window.scrapingData.highlightElement.style.backgroundColor = '';
            }
            
            if (element) {
                element.style.outline = '2px solid #007bff';
                element.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
                window.scrapingData.highlightElement = element;
            }
        };

        const selectElement = (element) => {
            const rect = element.getBoundingClientRect();
            const selector = generateUniqueSelector(element);
            
            const elementData = {
                id: Date.now() + Math.random(),
                tagName: element.tagName.toLowerCase(),
                selector: selector,
                text: element.textContent?.trim() || '',
                href: element.href || '',
                src: element.src || '',
                className: element.className || '',
                id: element.id || '',
                rect: {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height
                },
                attributes: {},
                computedStyles: {}
            };

            const importantAttributes = ['title', 'alt', 'data-*', 'aria-*'];
            for (let attr of element.attributes) {
                if (importantAttributes.some(important => attr.name.startsWith(important.replace('*', '')))) {
                    elementData.attributes[attr.name] = attr.value;
                }
            }

            const styles = window.getComputedStyle(element);
            elementData.computedStyles = {
                color: styles.color,
                backgroundColor: styles.backgroundColor,
                fontSize: styles.fontSize,
                fontFamily: styles.fontFamily,
                fontWeight: styles.fontWeight,
                textAlign: styles.textAlign,
                display: styles.display,
                position: styles.position
            };

            window.scrapingData.selectedElements.push(elementData);
            
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: absolute;
                left: ${rect.x}px;
                top: ${rect.y}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                border: 2px solid #28a745;
                background: rgba(40, 167, 69, 0.1);
                pointer-events: none;
                z-index: 1000000;
            `;
            indicator.textContent = window.scrapingData.selectedElements.length;
            indicator.style.display = 'flex';
            indicator.style.alignItems = 'center';
            indicator.style.justifyContent = 'center';
            indicator.style.color = '#28a745';
            indicator.style.fontWeight = 'bold';
            indicator.style.fontSize = '12px';
            
            overlay.appendChild(indicator);
        };

        document.addEventListener('mouseover', (e) => {
            if (window.scrapingData.isSelecting) {
                highlightElement(e.target);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (window.scrapingData.isSelecting && window.scrapingData.highlightElement === e.target) {
                highlightElement(null);
            }
        });

        document.addEventListener('click', (e) => {
            if (window.scrapingData.isSelecting) {
                e.preventDefault();
                e.stopPropagation();
                selectElement(e.target);
            }
        });

        window.startElementSelection = () => {
            window.scrapingData.isSelecting = true;
            overlay.style.pointerEvents = 'auto';
            document.body.style.cursor = 'crosshair';
        };

        window.stopElementSelection = () => {
            window.scrapingData.isSelecting = false;
            overlay.style.pointerEvents = 'none';
            document.body.style.cursor = 'default';
            highlightElement(null);
        };

        window.getSelectedElements = () => {
            return window.scrapingData.selectedElements;
        };

        window.clearSelectedElements = () => {
            window.scrapingData.selectedElements = [];
            overlay.innerHTML = '';
        };

        window.removeElementSelection = (elementId) => {
            window.scrapingData.selectedElements = window.scrapingData.selectedElements.filter(el => el.id !== elementId);
            overlay.innerHTML = '';
            window.scrapingData.selectedElements.forEach((el, index) => {
                const indicator = document.createElement('div');
                indicator.style.cssText = `
                    position: absolute;
                    left: ${el.rect.x}px;
                    top: ${el.rect.y}px;
                    width: ${el.rect.width}px;
                    height: ${el.rect.height}px;
                    border: 2px solid #28a745;
                    background: rgba(40, 167, 69, 0.1);
                    pointer-events: none;
                    z-index: 1000000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #28a745;
                    font-weight: bold;
                    font-size: 12px;
                `;
                indicator.textContent = index + 1;
                overlay.appendChild(indicator);
            });
        };
    });
};

const performVisualScraping = async ({
    res,
    token,
    websiteUrl,
    userId,
    agentId,
    chatId,
    conf,
    selectedElements = []
}) => {
    const browser = await chromium.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const context = await browser.newContext({
            viewport: { width: 1280, height: 720 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });

        const page = await context.newPage();

        await page.goto(websiteUrl, { waitUntil: 'networkidle' });

        const favicon = await getFavicon(websiteUrl);

        await createSelectionOverlay(page);

        if (selectedElements.length > 0) {
            await page.evaluate((elements) => {
                window.scrapingData.selectedElements = elements;
                elements.forEach((el, index) => {
                    const indicator = document.createElement('div');
                    indicator.style.cssText = `
                        position: absolute;
                        left: ${el.rect.x}px;
                        top: ${el.rect.y}px;
                        width: ${el.rect.width}px;
                        height: ${el.rect.height}px;
                        border: 2px solid #28a745;
                        background: rgba(40, 167, 69, 0.1);
                        pointer-events: none;
                        z-index: 1000000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #28a745;
                        font-weight: bold;
                        font-size: 12px;
                    `;
                    indicator.textContent = index + 1;
                    document.getElementById('scraping-overlay').appendChild(indicator);
                });
            }, selectedElements);
        }

        const screenshot = await page.screenshot({ fullPage: true });

        const pageInfo = await page.evaluate(() => {
            return {
                title: document.title,
                url: window.location.href,
                description: document.querySelector('meta[name="description"]')?.content || '',
                keywords: document.querySelector('meta[name="keywords"]')?.content || '',
                viewport: document.querySelector('meta[name="viewport"]')?.content || '',
                charset: document.characterSet || 'UTF-8'
            };
        });

        const response = {
            success: true,
            data: {
                url: websiteUrl,
                favicon: favicon,
                pageInfo: pageInfo,
                selectedElements: selectedElements,
                screenshot: screenshot.toString('base64'),
                timestamp: new Date().toISOString()
            }
        };

        await sendTextData({
            res,
            token,
            data: response,
            userId,
            agentId,
            chatId,
            conf
        });

        return response;

    } catch (error) {
        console.error('Error in visual scraping:', error);
        
        await sendTextData({
            res,
            token,
            data: {
                success: false,
                error: error.message
            },
            userId,
            agentId,
            chatId,
            conf
        });

        throw error;
    } finally {
        await browser.close();
    }
};

const performWebScraping = async ({
    res,
    token,
    websiteUrl,
    userId,
    agentId,
    chatId,
    conf,
}) => {
    try {

        await sendTextData({
            res,
            data: {
                text: "🔍 Validando página web...",
                status: "validating"
            },
            type: 'scraping',
            conf
        });

        const browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        await page.setViewportSize({ width: 1920, height: 1080 });

        const timeout = 15000;
        const normalizedWebsiteUrl = ensureHttpProtocol(websiteUrl);
        await page.goto(normalizedWebsiteUrl, {
            waitUntil: 'networkidle',
            timeout: timeout
        });

        const pageTitle = await page.title();
        const hasContent = await page.evaluate(() => {
            return document.body && document.body.innerText.length > 0;
        });


        const screenshotBuffer = await page.screenshot({
            fullPage: true,
            type: 'png'
        });

        const pageData = await page.evaluate(() => {
            const getComputedStyles = (element) => {
                const styles = window.getComputedStyle(element);
                return {
                    width: styles.width,
                    height: styles.height,
                    position: styles.position,
                    top: styles.top,
                    left: styles.left,
                    backgroundColor: styles.backgroundColor,
                    color: styles.color,
                    fontSize: styles.fontSize,
                    fontFamily: styles.fontFamily,
                    border: styles.border,
                    borderRadius: styles.borderRadius,
                    padding: styles.padding,
                    margin: styles.margin,
                    display: styles.display,
                    visibility: styles.visibility,
                    opacity: styles.opacity,
                    zIndex: styles.zIndex
                };
            };

            const serializeElement = (element) => {
                if (!element) return null;
                
                const rect = element.getBoundingClientRect();
                const styles = getComputedStyles(element);
                
                return {
                    tagName: element.tagName.toLowerCase(),
                    id: element.id || '',
                    className: element.className || '',
                    textContent: element.textContent?.trim().substring(0, 100) || '',
                    href: element.href || '',
                    src: element.src || '',
                    type: element.type || '',
                    value: element.value || '',
                    placeholder: element.placeholder || '',
                    rect: {
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height
                    },
                    styles: styles,
                    isVisible: rect.width > 0 && rect.height > 0 && styles.visibility !== 'hidden' && styles.display !== 'none'
                };
            };

            const interactiveElements = [];
            
            document.querySelectorAll('button, input[type="button"], input[type="submit"], a.btn, .btn').forEach(el => {
                const serialized = serializeElement(el);
                if (serialized && serialized.isVisible) {
                    serialized.elementType = 'button';
                    interactiveElements.push(serialized);
                }
            });

            document.querySelectorAll('a').forEach(el => {
                const serialized = serializeElement(el);
                if (serialized && serialized.isVisible && !el.classList.contains('btn')) {
                    serialized.elementType = 'link';
                    interactiveElements.push(serialized);
                }
            });

            document.querySelectorAll('input, textarea, select').forEach(el => {
                const serialized = serializeElement(el);
                if (serialized && serialized.isVisible) {
                    serialized.elementType = 'input';
                    interactiveElements.push(serialized);
                }
            });

            document.querySelectorAll('img').forEach(el => {
                const serialized = serializeElement(el);
                if (serialized && serialized.isVisible) {
                    serialized.elementType = 'image';
                    interactiveElements.push(serialized);
                }
            });

            const getHTMLWithStyles = () => {
                const clone = document.cloneNode(true);
                
                const addInlineStyles = (element) => {
                    if (element.nodeType === Node.ELEMENT_NODE) {
                        const styles = window.getComputedStyle(element);
                        let inlineStyles = '';
                        
                        const importantProps = [
                            'width', 'height', 'position', 'top', 'left', 'right', 'bottom',
                            'backgroundColor', 'color', 'fontSize', 'fontFamily', 'fontWeight',
                            'border', 'borderRadius', 'padding', 'margin', 'display', 'visibility',
                            'opacity', 'zIndex', 'background', 'textAlign', 'verticalAlign',
                            'flexDirection', 'justifyContent', 'alignItems', 'flexWrap'
                        ];
                        
                        importantProps.forEach(prop => {
                            const value = styles.getPropertyValue(prop);
                            if (value && value !== 'initial' && value !== 'normal') {
                                inlineStyles += `${prop}: ${value}; `;
                            }
                        });
                        
                        if (inlineStyles) {
                            element.setAttribute('style', inlineStyles);
                        }
                        
                        Array.from(element.children).forEach(addInlineStyles);
                    }
                };
                
                addInlineStyles(clone);
                return clone.documentElement.outerHTML;
            };

            return {
                info: {
                    title: document.title,
                    description: document.querySelector('meta[name="description"]')?.content || '',
                    url: window.location.href,
                    elements: {
                        buttons: document.querySelectorAll('button, input[type="button"], input[type="submit"], a.btn').length,
                        forms: document.querySelectorAll('form').length,
                        images: document.querySelectorAll('img').length,
                        links: document.querySelectorAll('a').length
                    },
                },
                interactiveElements: interactiveElements,
                htmlWithStyles: getHTMLWithStyles()
            };
        });

        if (!hasContent) {
            throw new Error('La página no tiene contenido visible');
        }

        await browser.close();

        const resizedBuffer = await sharp(screenshotBuffer)
            .resize({
                width: 1200,
                fit: 'contain'
            })
            .toBuffer();


        await sendTextData({
            res,
            data: {
                text: "✅ Análisis completado. He capturado información y la página web.",
                info: pageData.info,
                status: "ready-info"
            },
            type: 'scraping',
        });

        await sendTextData({
            res,
            data: {
                text: "🎨 HTML renderizado disponible para selección de elementos",
                htmlWithStyles: pageData.htmlWithStyles,
                interactiveElements: pageData.interactiveElements,
                status: "ready-html"
            },
            type: 'scraping',
        });

        await sendTextData({
            res,
            data: {
                text: "✅ Análisis completado. He capturado la página web y estoy listo para recibir tu captura de pantalla específica.",
                screenshot: resizedBuffer.toString('base64'),
                status: "ready-screenshot"
            },
            type: 'scraping',
        });



        const dbChat = await connectDB(`db_${userId}_chat`);
        let chat = await dbChat.get(chatId);

        let websiteScreenshot = resizedBuffer.toString('base64');

        chat.state = {
            ...chat.state,
            step: 'scraped',
            websiteScreenshot: websiteScreenshot,
            info: pageData.info
        };

        await dbChat.insert(chat);

    } catch (error) {
        console.error('Error in performWebScraping:', error);

        let errorMessage = "❌ Error al analizar la página web. Verifica que la URL sea correcta y accesible.";

        if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
            errorMessage = "❌ No se pudo resolver el nombre del dominio. Verifica que la URL sea correcta.";
        } else if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
            errorMessage = "❌ Conexión rechazada. El servidor no está disponible.";
        } else if (error.message.includes('net::ERR_CONNECTION_TIMED_OUT')) {
            errorMessage = "❌ Tiempo de conexión agotado. El servidor no responde.";
        } else if (error.message.includes('net::ERR_SSL_PROTOCOL_ERROR')) {
            errorMessage = "❌ Error de protocolo SSL. Verifica que la URL use HTTPS correctamente.";
        } else if (error.message.includes('timeout')) {
            errorMessage = "❌ Tiempo de espera agotado. La página tardó demasiado en cargar.";
        } else if (error.message.includes('La página no tiene contenido visible')) {
            errorMessage = "❌ La página no tiene contenido visible o está vacía.";
        }

        await sendTextData({
            res,
            data: {
                type: 'error',
                text: errorMessage,
                error: error.message
            },
            type: 'scraping',
            conf
        });
    }
};

const compareAndExtract = async ({
    res,
    token,
    websiteScreenshot,
    userScreenshot,
    userText,
    websiteUrl,
    userId,
    agentId,
    chatId,
    conf
}) => {
    try {
        await sendTextData({
            res,
            data: {
                text: "🔍 Analizando y comparando las imágenes...",
                status: "analyzing"
            },
            type: 'status',
            conf
        });

        const comparisonPrompt = `
        Analiza estas dos imágenes y responde en formato JSON:

        IMAGEN 1: Captura completa de la página web
        IMAGEN 2: Captura específica del usuario

        TEXTO DEL USUARIO: "${userText}"

        TAREA:
        1. Compara las dos imágenes para identificar si el elemento de la imagen 2 existe en la imagen 1
        2. Si existe, identifica:
           - Tipo de elemento (botón, enlace, texto, imagen, formulario, etc.)
           - Texto visible del elemento
           - Posición aproximada en la página
           - URL del elemento si es un enlace
           - Cualquier información adicional relevante
        3. Si no existe, indica por qué no se encuentra

        Responde en este formato JSON:
        {
          "match": true/false,
          "elementType": "tipo_de_elemento",
          "elementText": "texto_del_elemento",
          "position": "posición_aproximada",
          "url": "url_si_es_enlace",
          "confidence": 0-10,
          "explanation": "explicación_detallada",
          "additionalInfo": "información_adicional"
        }
        `;

        const comparisonResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4o-mini",
            max_tokens: 1000,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: comparisonPrompt
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/png;base64,${websiteScreenshot}`
                            }
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/png;base64,${userScreenshot}`
                            }
                        }
                    ]
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });

        let comparisonResult;
        try {
            const responseText = comparisonResponse.data.choices[0].message.content;
            comparisonResult = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Error parsing comparison result:', parseError);
            comparisonResult = {
                match: false,
                explanation: "Error al procesar la comparación de imágenes"
            };
        }

        const dbChat = await connectDB(`db_${userId}_chat`);
        let chat = await dbChat.get(chatId);

        chat.state = {
            ...chat.state,
            step: 'completed',
            matchedComponent: comparisonResult,
            extractedData: {
                websiteUrl: websiteUrl,
                userText: userText,
                comparison: comparisonResult,
                timestamp: new Date().toISOString()
            }
        };

        await dbChat.insert(chat);

        await sendTextData({
            res,
            data: {
                text: comparisonResult.match
                    ? `✅ Elemento encontrado: ${comparisonResult.elementText || comparisonResult.elementType}`
                    : "❌ No se encontró el elemento especificado en la página web",
                comparison: comparisonResult,
                websiteUrl: websiteUrl,
                status: "completed"
            },
            type: 'comparison-result',
            conf
        });

    } catch (error) {
        console.error('Error in compareAndExtract:', error);
        await sendTextData({
            res,
            data: {
                text: "❌ Error al comparar las imágenes. Por favor, intenta de nuevo.",
                error: error.message
            },
            type: 'error',
            conf
        });
    }
};

module.exports = {
    meetScraping,
    performWebScraping,
    compareAndExtract,
    saveTemplate,
    loadTemplates,
    loadTemplate,
    deleteTemplate,
    executeTemplate
};
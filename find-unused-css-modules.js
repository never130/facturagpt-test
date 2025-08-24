const fg = require('fast-glob');
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const safeParser = require('postcss-safe-parser');

const COMPONENT_GLOB = ['src/**/*.{js,jsx,ts,tsx}'];
const STYLE_GLOB = ['src/**/*.module.{css,scss}'];

(async () => {
  const styleFiles = await fg(STYLE_GLOB);
  const componentFiles = await fg(COMPONENT_GLOB);

  const classUsage = new Set();

  for (const file of componentFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const matches = content.match(/styles\.([a-zA-Z0-9_]+)/g);
    if (matches) {
      matches.forEach(match => {
        const className = match.split('.')[1];
        classUsage.add(className);
      });
    }
  }


  for (const cssFile of styleFiles) {
    const cssContent = fs.readFileSync(cssFile, 'utf-8');
    const root = postcss().process(cssContent, { parser: safeParser }).root;

    const definedClasses = new Set();

    root.walkRules(rule => {
      rule.selectors.forEach(selector => {
        const match = selector.match(/^\.([a-zA-Z0-9_-]+)/);
        if (match) {
          definedClasses.add(match[1]);
        }
      });
    });

    const unused = [...definedClasses].filter(cls => !classUsage.has(cls));

    if (unused.length > 0) {
      console.log(`❌ ${cssFile}`);
      unused.forEach(cls => console.log(`   - ${cls}`));
    } else {
      console.log(`✅ ${cssFile} (todo usado)`);
    }
  }

  console.log('\n✅ Análisis finalizado.\n');
})();

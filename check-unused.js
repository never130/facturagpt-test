const madge = require('madge');
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.svg'];

const listAllFiles = (dir, allFiles = []) => {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      listAllFiles(fullPath, allFiles);
    } else if (EXTENSIONS.includes(path.extname(entry))) {
      allFiles.push(path.resolve(fullPath));
    }
  }
  return allFiles;
};

(async () => {
  console.log('🔍 Analizando dependencias con madge...');

  const result = await madge(path.join(SRC_DIR, './index.jsx'), {
    baseDir: SRC_DIR,
    includeNpm: false,
    fileExtensions: EXTENSIONS.map(ext => ext.replace('.', '')),
    alias: {
      '@': SRC_DIR, 
    },
  });

  const usedFiles = new Set(Object.keys(result.obj()).map(f => path.resolve(SRC_DIR, f)));

  const allFiles = listAllFiles(SRC_DIR);

  const unusedFiles = allFiles.filter(file => !usedFiles.has(file));

  console.log('\n🚫 Archivos POTENCIALMENTE NO USADOS:\n');
  if (unusedFiles.length === 0) {
    console.log('✅ Todos los archivos se usan correctamente.');
  } else {
    unusedFiles.forEach(file => console.log(file));
    fs.writeFileSync('unused-files.txt', unusedFiles.join('\n'), 'utf-8');
    console.log(`\n💾 Guardado en unused-files.txt`);
  }
})();

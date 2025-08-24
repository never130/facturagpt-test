const fs = require('fs');
const path = require('path');

function readImageBase64(filePath) {
    const fullPath = path.join(__dirname, filePath);
  
    try {
      const imageBuffer = fs.readFileSync(fullPath);
      const base64Image = imageBuffer.toString('base64');
  
      const extension = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
      };
      const mimeType = mimeTypes[extension] || 'application/octet-stream';
  
      return `data:${mimeType};base64,${base64Image}`;
    } catch (error) {
      console.error(`Error al leer la imagen ${filePath}: ${error.message}`);
      return null;
    }
  }


const addons = [{
    image: readImageBase64('./assets/icon/logo-gpt.jpg'),
    title: 'html gpt',
    tags: ['code', 'html', 'design', 'structure'],
    description: 'Un generador de código capaz de diseñar código en varios lenguajes de programación',
    fav: false,
    labels: {
        author: 'owner',
        download: '20k'
    }
},{
    image: readImageBase64('./assets/icon/logo-gpt.jpg'),
    title: 'data gpt',
    tags: ['bi', 'pb', 'crm', 'erp'],
    description: 'Un analizador de código capaz de interpretar graficas y obtener resultados',
    fav: false,
    labels: {
        author: 'owner',
        download: '20k'
    }
},{
    image: readImageBase64('./assets/icon/logo-gpt.jpg'),
    title: 'docs gpt',
    tags: ['docs', 'drive', 'data'],
    description: 'Un drive universal para los recursos de tu ordenador en la nube',
    fav: false,
    labels: {
        author: 'owner',
        download: '20k'
    }
},{
    image: readImageBase64('./assets/icon/logo-gpt.jpg'),
    title: 'flow gpt',
    tags: ['flow', 'diagram', 'brain'],
    description: 'Un diagrama para obtener datos sobre mapas mentales',
    fav: false,
    labels: {
        author: 'owner',
        download: '20k'
    }
},{
    image: readImageBase64('./assets/icon/logo-gpt.jpg'),
    title: 'eye gpt',
    tags: ['ai', 'modern', 'science', 'art'],
    description: 'Con una imagen de tus ojos descubre el universo de información de tus ojos',
    fav: false,
    labels: {
        author: 'owner',
        download: '20k'
    }
}]



module.exports = addons
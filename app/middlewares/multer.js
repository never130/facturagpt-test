
const multer = require('multer');

const storage = multer.memoryStorage();

const multerUploads = multer({
  storage: storage,
  limits: {
    fieldSize: 10 * 1024 * 1024, 
  },
}).single('image');

module.exports = { multerUploads };
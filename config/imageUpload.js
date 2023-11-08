const multer = require('multer');
const storage = new multer.memoryStorage();
// Create multer object
const imageUpload = multer({
    storage:storage,
});

module.exports = {imageUpload};
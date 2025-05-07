const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const uploadController = require('../controllers/uploadController');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.csv'];
  const ext = path.extname(file.originalname).toLowerCase();
  cb(null, allowedTypes.includes(ext));
};

const upload = multer({ storage, fileFilter });

// Upload endpoint
router.post('/', upload.single('file'), uploadController.handleUpload);

module.exports = router;

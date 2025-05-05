import express from 'express';

const express = require('express');
const multer = require('multer');
const { handleCSVUpload } = require('../controllers/csvController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // temporary storage

router.post('/upload', upload.single('file'), handleCSVUpload);

module.exports = router;

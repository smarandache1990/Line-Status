// routes/csvRoutes.js
import express from 'express';
import {
  uploadCsv,
  listFiles,
  getFileRecords,
  updateFile,
  deleteFile,
} from '../controllers/csvController.js';

const router = express.Router();

router.post('/upload', uploadCsv);
router.get('/files', listFiles);
router.get('/file/:id', getFileRecords);
router.put('/file/:id', updateFile);
router.delete('/file/:id', deleteFile);

export default router;

// controllers/csvController.js
import pool from '../db.js';
import csvParser from '../utils/csvParser.js';

export const uploadCsv = async (req, res) => {
  try {
    const { fileName, csvData } = req.body;
    const result = await pool.query(
      'INSERT INTO files (file_name) VALUES ($1) RETURNING id',
      [fileName]
    );
    const fileId = result.rows[0].id;

    const insertPromises = csvData.map(row =>
      pool.query(
        'INSERT INTO records (file_id, timestamp, total) VALUES ($1, $2, $3)',
        [fileId, row.timestamp, row.total]
      )
    );

    await Promise.all(insertPromises);
    res.status(201).json({ message: 'CSV uploaded', fileId });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const listFiles = async (req, res) => {
  const result = await pool.query('SELECT * FROM files ORDER BY created_at DESC');
  res.json(result.rows);
};

export const getFileRecords = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM records WHERE file_id = $1 ORDER BY timestamp', [id]);
  res.json(result.rows);
};

export const updateFile = async (req, res) => {
  const { id } = req.params;
  const { fileName } = req.body;
  await pool.query('UPDATE files SET file_name = $1 WHERE id = $2', [fileName, id]);
  res.json({ message: 'File updated' });
};

export const deleteFile = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM records WHERE file_id = $1', [id]);
  await pool.query('DELETE FROM files WHERE id = $1', [id]);
  res.json({ message: 'File and records deleted' });
};

const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../db');

async function handleCsvUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, path } = req.file;

    // 1. Insert into 'files' table
    const fileInsertResult = await pool.query(
      'INSERT INTO files (filename) VALUES ($1) RETURNING id',
      [originalname]
    );
    const fileId = fileInsertResult.rows[0].id;

    // 2. Parse CSV and insert into 'records' table
    const records = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (row) => {
        const timestamp = new Date(row.timestamp);
        const volume = parseFloat(row.volume);
        if (!isNaN(timestamp) && !isNaN(volume)) {
          records.push({ file_id: fileId, timestamp, volume });
        }
      })
      .on('end', async () => {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          for (const record of records) {
            await client.query(
              'INSERT INTO records (file_id, timestamp, volume) VALUES ($1, $2, $3)',
              [record.file_id, record.timestamp, record.volume]
            );
          }
          await client.query('COMMIT');
          res.json({ message: `Inserted ${records.length} records for file ID ${fileId}` });
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(err);
          res.status(500).json({ error: 'Failed to insert records' });
        } finally {
          client.release();
        }
        fs.unlinkSync(path); // optional: delete uploaded file from disk
      });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  handleCsvUpload,
};

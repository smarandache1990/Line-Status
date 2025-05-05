const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../db');

async function handleCSVUpload(req, res) {
  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row); // Each `row` is an object from CSV
    })
    .on('end', async () => {
      try {
        for (const record of results) {
          await pool.query(
            'INSERT INTO records (timestamp, type, total) VALUES ($1, $2, $3)',
            [record.timestamp, record.type, record.total]
          );
        }
        fs.unlinkSync(filePath); // Clean up
        res.status(200).json({ message: 'Upload complete!' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error saving to database' });
      }
    });
}

module.exports = { handleCSVUpload };

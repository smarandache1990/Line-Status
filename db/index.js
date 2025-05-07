const { Pool } = require("pg");
const express = require('express');
const app = express();
const uploadRoutes = require('./routes/upload');

require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());

// Serve uploaded files (optional)
app.use('/uploads', express.static('uploads'));

// Mount the upload route
app.use('/upload', uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


module.exports = pool;

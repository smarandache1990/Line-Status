CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  file_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS records (
  id SERIAL PRIMARY KEY,
  file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
  timestamp TIMESTAMP,
  total NUMERIC
);

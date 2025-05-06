-- Table to store file uploads (metadata)
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Table to store raw entries parsed from uploaded CSVs
CREATE TABLE entries (
    id SERIAL PRIMARY KEY,
    file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    volume NUMERIC(10,2) NOT NULL
);

-- Table to store aggregated hourly summaries
CREATE TABLE hourly_aggregates (
    id SERIAL PRIMARY KEY,
    file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
    hour_start TIMESTAMP NOT NULL, -- start of the hour (e.g., 2025-04-30 14:00:00)
    hour_label TEXT NOT NULL,      -- optional: '14:00', for display
    op_total NUMERIC(10,2) DEFAULT 0,
    bb_total NUMERIC(10,2) DEFAULT 0,
    combined_total NUMERIC(10,2) GENERATED ALWAYS AS (op_total + bb_total) STORED,
    running_total NUMERIC(10,2), -- populated after sorting by hour
    projected_remaining NUMERIC(10,2),
    percent_projected NUMERIC(5,2)
);
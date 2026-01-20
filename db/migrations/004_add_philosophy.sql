-- Add philosophy table
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS philosophy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  line_number INTEGER NOT NULL UNIQUE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial philosophy lines
INSERT OR IGNORE INTO philosophy (line_number, text) VALUES
(1, 'I am a'),
(2, 'digital'),
(3, 'architect'),
(4, 'obsessed'),
(5, 'with'),
(6, 'performance'),
(7, 'aesthetics.');

COMMIT;

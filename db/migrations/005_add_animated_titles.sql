-- Add animated titles table
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS animated_titles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial animated titles
INSERT OR IGNORE INTO animated_titles (title, order_index) VALUES
('Developer', 1),
('Engineer', 2),
('Architect', 3),
('Builder', 4);

COMMIT;

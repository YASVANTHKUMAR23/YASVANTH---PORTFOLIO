-- Add social links table
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS social_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial social links
INSERT OR IGNORE INTO social_links (platform, url) VALUES
('twitter', 'https://twitter.com'),
('linkedin', 'https://linkedin.com'),
('github', 'https://github.com'),
('instagram', 'https://instagram.com'),
('email', 'mailto:hello@larson.design');

COMMIT;

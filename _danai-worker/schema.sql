-- DanAI question log. Create it once with:
--   npx wrangler d1 execute danai-questions --remote --file=schema.sql
CREATE TABLE IF NOT EXISTS questions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  asked_at   TEXT NOT NULL DEFAULT (datetime('now')),  -- UTC
  page       TEXT,     -- the page the visitor asked from, like /resume-wootric.html
  question   TEXT NOT NULL,
  answer     TEXT,
  faq        INTEGER,  -- the FAQ number in faq.md that answered it, if any
  sources    TEXT,     -- the source links DanAI showed
  status     TEXT      -- ok, error or rate_limited
);
CREATE INDEX IF NOT EXISTS questions_asked_at ON questions (asked_at);

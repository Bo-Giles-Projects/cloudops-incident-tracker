CREATE TABLE IF NOT EXISTS incidents (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  status VARCHAR(15) NOT NULL DEFAULT 'open' CHECK (status IN ('open','investigating','resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

import express from 'express';
import cors from 'cors';

export function createApp(pool) {
  const app = express();
  app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'cloudops-api', timestamp: new Date().toISOString() }));

  app.get('/api/incidents', async (_req, res, next) => {
    try {
      const result = await pool.query('SELECT id, title, severity, status, created_at FROM incidents ORDER BY created_at DESC, id DESC');
      res.json(result.rows);
    } catch (err) { next(err); }
  });

  app.post('/api/incidents', async (req, res, next) => {
    const { title, severity = 'medium' } = req.body ?? {};
    if (typeof title !== 'string' || title.trim().length < 3 || title.length > 150 || !['low','medium','high','critical'].includes(severity)) {
      return res.status(400).json({ error: 'Title must be 3–150 characters and severity must be low, medium, high, or critical.' });
    }
    try {
      const result = await pool.query(
        'INSERT INTO incidents (title, severity) VALUES ($1, $2) RETURNING id, title, severity, status, created_at',
        [title.trim(), severity]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) { next(err); }
  });

  app.patch('/api/incidents/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    const { status } = req.body ?? {};
    if (!Number.isSafeInteger(id) || id < 1 || !['open','investigating','resolved'].includes(status)) {
      return res.status(400).json({ error: 'Valid incident ID and status are required.' });
    }
    try {
      const result = await pool.query('UPDATE incidents SET status = $1 WHERE id = $2 RETURNING id, title, severity, status, created_at', [status, id]);
      if (!result.rows.length) return res.status(404).json({ error: 'Incident not found.' });
      res.json(result.rows[0]);
    } catch (err) { next(err); }
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });
  return app;
}

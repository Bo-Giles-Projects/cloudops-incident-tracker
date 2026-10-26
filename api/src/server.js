
import dotenv from 'dotenv';
import pg from 'pg';
import { createApp } from './app.js';

// Load environment variables from the project root.
dotenv.config({ path: new URL('../../.env', import.meta.url) });
console.log('DATABASE_URL loaded:', typeof process.env.DATABASE_URL === 'string');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

const port = Number(process.env.PORT || 3001);

createApp(pool).listen(port, '0.0.0.0', () => {
  console.log(`API listening on ${port}`);
});

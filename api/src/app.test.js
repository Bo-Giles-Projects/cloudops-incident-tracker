import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './app.js';

test('health endpoint reports ok', async () => {
  const server = createApp({ query: async () => ({ rows: [] }) }).listen(0);
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/health`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).status, 'ok');
  } finally { await new Promise(resolve => server.close(resolve)); }
});

test('rejects incident titles shorter than three characters', async () => {
  const server = createApp({ query: async () => { throw new Error('Should not query database'); } }).listen(0);
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/incidents`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'x' })
    });
    assert.equal(response.status, 400);
  } finally { await new Promise(resolve => server.close(resolve)); }
});

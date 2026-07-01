const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../server');

// Boot the app on an ephemeral port, make one request, then shut it down.
function request(method, pathname) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      const req = http.request(
        { method, host: '127.0.0.1', port, path: pathname },
        (res) => {
          let body = '';
          res.on('data', (chunk) => { body += chunk; });
          res.on('end', () => {
            server.close();
            resolve({
              statusCode: res.statusCode,
              contentType: res.headers['content-type'],
              body,
            });
          });
        }
      );
      req.on('error', (err) => { server.close(); reject(err); });
      req.end();
    });
  });
}

// Happy path: GET /health returns 200 and JSON { status: "ok" }.
test('GET /health returns 200 with JSON { status: "ok" }', async () => {
  const res = await request('GET', '/health');
  assert.strictEqual(res.statusCode, 200);
  assert.match(res.contentType, /application\/json/);
  assert.deepStrictEqual(JSON.parse(res.body), { status: 'ok' });
});

// Edge case: only GET is defined, so other methods fall through to 404.
test('POST /health is not handled and returns 404', async () => {
  const res = await request('POST', '/health');
  assert.strictEqual(res.statusCode, 404);
});

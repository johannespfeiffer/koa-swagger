/*eslint-disable no-eval */
import supertest from 'supertest';
import Promise from 'bluebird';

Promise.promisifyAll(supertest.Test.prototype);

describe('code example', () => {
  const app = require('../__testData__/app');
  const server = app.listen();
  const request = supertest(server);

  it('should 404 or 405 when accessing the wrong endpoint', async () => {
    await request
    .get('/api/nope')
    .expect(404)
    .endAsync();
    await request
    .post('/api/hello/bob')
    .query({ chk: true })
    .expect(405)
    .endAsync();
  });

  it('should 400 when providing wrong parameters', async () => {
    await request
    .get('/api/hello/bob')
    .query({ chuk: true })
    .expect(400)
    .endAsync();
  });

  it('should 200 when providing the right parameters', async () => {
    await request
    .get('/api/hello/bob')
    .query({ punctuation: '!' })
    .expect(200)
    .expect(/Hello bob!/)
    .endAsync();
    await request
    .get('/api/hello/bob')
    .query({ punctuation: '.' })
    .expect(200)
    .expect(/Hello bob\./)
    .endAsync();
  });

  afterAll(() => {
    server.close();
  });
});

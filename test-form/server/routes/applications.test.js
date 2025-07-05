const request = require('supertest');
const express = require('express');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

const pool = require('../db');
const router = require('./applications');

const app = express();
app.use(express.json());
app.use(router);

describe('Applications API', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  test('GET /api/applications returns list of applications', async () => {
    const apps = [{ id: 'a1' }, { id: 'a2' }];
    pool.query.mockResolvedValueOnce({ rows: apps });

    const res = await request(app).get('/api/applications');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(apps);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM applications ORDER BY updated_at DESC'
    );
  });

  test('POST /api/applications/:appId saves application', async () => {
    pool.query.mockResolvedValueOnce({});
    const data = {
      userId: 'user1',
      serviceKey: 'childcare',
      status: 'complete',
      currentStep: 2,
      stepData: { foo: 'bar' },
      allData: { bar: 'baz' },
    };

    const res = await request(app)
      .post('/api/applications/app123')
      .send(data);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO applications'),
      ['app123', 'user1', 'childcare', 'complete', 2, { foo: 'bar' }, { bar: 'baz' }]
    );
  });

  test('DELETE /api/applications/:appId deletes application', async () => {
    pool.query.mockResolvedValueOnce({});

    const res = await request(app).delete('/api/applications/app123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
    expect(pool.query).toHaveBeenCalledWith(
      'DELETE FROM applications WHERE id = $1',
      ['app123']
    );
  });
});

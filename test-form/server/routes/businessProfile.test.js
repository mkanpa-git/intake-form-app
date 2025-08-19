const request = require('supertest');
const express = require('express');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

const pool = require('../db');
const router = require('./businessProfile');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.isAuthenticated = () => true;
  req.user = { id: 'user1' };
  next();
});
app.use(router);

describe('Business Profile API', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  test('GET /api/profile/business/:businessId returns business', async () => {
    const biz = { id: 'b1', user_id: 'user1', legal_name: 'Acme' };
    pool.query.mockResolvedValueOnce({ rows: [biz] });

    const res = await request(app).get('/api/profile/business/b1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(biz);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM businesses WHERE id=$1 AND user_id=$2',
      ['b1', 'user1']
    );
  });

  test('PUT /api/profile/business/:businessId upserts business', async () => {
    const saved = { id: 'b1', user_id: 'user1', legal_name: 'New' };
    pool.query.mockResolvedValueOnce({ rows: [saved], rowCount: 1 });

    const res = await request(app)
      .put('/api/profile/business/b1')
      .send({ legal_name: 'New' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(saved);
    const call = pool.query.mock.calls[0];
    expect(call[0]).toMatch(/INSERT INTO businesses/);
    expect(call[0]).toMatch(/ON CONFLICT \(id\) DO UPDATE/);
    expect(call[1][0]).toBe('b1');
    expect(call[1][1]).toBe('user1');
    expect(call[1][2]).toBe('New');
  });

  test('PUT returns 403 when user does not own record', async () => {
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const res = await request(app)
      .put('/api/profile/business/b1')
      .send({ legal_name: 'New' });

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: 'Forbidden' });
  });
});

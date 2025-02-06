import request from 'supertest';
import { app, server } from '../src/server/server';

describe('Server API Tests', () => {
  afterAll(() => {
    server.close(); 
  });

  it(' project data', async () => {
    const response = await request(app).get('/get');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({}); 
  });
});

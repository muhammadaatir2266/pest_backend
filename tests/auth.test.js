const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/database');

// Mock Prisma client methods for deterministic standalone unit testing
jest.mock('../src/config/database', () => ({
  user: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  scan: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
}));

describe('Authentication API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /health should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('POST /api/auth/guest-login should create guest session', async () => {
    prisma.user.create.mockResolvedValue({
      id: 'guest-123',
      name: 'Guest Farmer',
      isGuest: true,
      farmLocation: 'Demo Farm',
      preferredLanguage: 'en',
    });

    const res = await request(app).post('/api/auth/guest-login');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data.user.isGuest).toBe(true);
  });

  it('POST /api/auth/login with invalid credentials should return 401', async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        loginIdentifier: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });
});

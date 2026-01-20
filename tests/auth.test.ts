import request from 'supertest';
// Since we are running against a live server in dev (or started via npm), 
// we can point supertest to the URL. 
// Or better, we can import the app if we exported it, but for now URL is easier given the setup.
const BASE_URL = 'http://localhost:3001';

describe('Auth API Integration', () => {
    let token: string;

    it('GET /health should return 200', async () => {
        const res = await request(BASE_URL).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('OK');
    });

    it('POST /api/auth/login should return token with correct password', async () => {
        const res = await request(BASE_URL)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'admin' }); // Default from .env

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('POST /api/auth/login should fail with wrong password', async () => {
        const res = await request(BASE_URL)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'wrongpassword' });

        expect(res.status).toBe(401);
    });

    it('POST /api/projects should be protected (fail without token)', async () => {
        const res = await request(BASE_URL)
            .post('/api/projects')
            .send({ title: 'Test', description: 'Test' });

        // Should be 401 or 403 (middleware returns 401 if no token)
        expect(res.status).toBe(401);
    });

    it('POST /api/projects should work with token', async () => {
        // This will create a real project in DB, so we might want to clean up or ignore.
        // For integration test on dev DB, it's messy. 
        // Ideally we use a test DB. 
        // We'll just verify we get past Auth. If it validates Zod, 400 means Auth passed.
        // If we send empty body with token:
        const res = await request(BASE_URL)
            .post('/api/projects')
            .set('Authorization', `Bearer ${token}`)
            .send({}); // Empty body -> Zod error (400)

        expect(res.status).toBe(400);
        // If Auth failed, it would be 401/403.
    });
});

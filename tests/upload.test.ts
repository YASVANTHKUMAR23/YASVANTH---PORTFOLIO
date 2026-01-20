/**
 * @jest-environment node
 */
import request from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs';
import uploadRoutes from '../server/uploadRoutes';

// Mock auth middleware for testing
jest.mock('../server/auth', () => ({
    authenticateToken: (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use('/api', uploadRoutes);
// Error handling for test app
app.use((err: any, req: any, res: any, next: any) => {
    res.status(500).json({ error: err.message });
});

describe('Upload API', () => {
    const testImagePath = path.join(__dirname, 'test-image.jpg');

    beforeAll(() => {
        // Create a dummy image file
        fs.writeFileSync(testImagePath, 'dummy image content');
    });

    afterAll(() => {
        // Clean up
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
        }
        // Clean up uploads
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (fs.existsSync(uploadsDir)) {
            fs.rmSync(uploadsDir, { recursive: true, force: true });
        }
    });

    it('should upload an image successfully', async () => {
        const res = await request(app)
            .post('/api/upload')
            .attach('image', testImagePath);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('imageUrl');
        expect(res.body.imageUrl).toMatch(/^\/uploads\/.+/);
    });

    it('should fail if no file is uploaded', async () => {
        const res = await request(app)
            .post('/api/upload');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'No file uploaded');
    });
});

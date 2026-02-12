import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper to load Vercel style functions as Express routes
async function loadApiRoutes(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await loadApiRoutes(fullPath);
        } else if (item.endsWith('.js')) {
            const apiRoot = path.join(__dirname, 'api');
            const relativePath = path.relative(apiRoot, dir);

            let routePath;
            if (item === 'index.js') {
                routePath = '/api/' + relativePath.replace(/\\/g, '/');
                if (routePath.endsWith('/')) routePath = routePath.slice(0, -1);
            } else {
                routePath = '/api/' + path.join(relativePath, item.replace('.js', '')).replace(/\\/g, '/');
            }

            try {
                const module = await import('file://' + fullPath.replace(/\\/g, '/'));
                const handler = module.default;
                if (typeof handler === 'function') {
                    console.log(`Registering route: ${routePath}`);
                    app.all(routePath === '/api' ? '/api' : routePath, handler);
                    // Also support trailing slash
                    if (routePath !== '/api') {
                        app.all(routePath + '/', handler);
                    }
                }
            } catch (err) {
                console.error(`Failed to load route ${fullPath}:`, err);
            }
        }
    }
}

// Load all files from the api directory
const apiDir = path.join(__dirname, 'api');
await loadApiRoutes(apiDir);

app.listen(port, () => {
    console.log(`Local API server running at http://localhost:${port}`);
});

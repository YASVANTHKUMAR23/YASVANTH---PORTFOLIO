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
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await loadApiRoutes(fullPath);
        } else if (item.endsWith('.js') && item !== 'index.js') {
            const routePath = '/api/' + path.relative(path.join(__dirname, 'api'), fullPath).replace(/\\/g, '/').replace('.js', '');
            const module = await import('file://' + fullPath.replace(/\\/g, '/'));
            const handler = module.default;
            console.log(`Registering route: ${routePath}`);
            app.all(routePath, handler);
        } else if (item === 'index.js') {
            const apiRoot = path.join(__dirname, 'api');
            if (dir === apiRoot) {
                // Skip base api index if not needed or handle it
                continue;
            }
            const relativePath = path.relative(apiRoot, dir);
            const routePath = '/api/' + relativePath.replace(/\\/g, '/');
            const module = await import('file://' + fullPath.replace(/\\/g, '/'));
            const handler = module.default;
            console.log(`Registering route: ${routePath}`);
            app.all(routePath === '/api/' ? '/api' : routePath, handler);
        }
    }
}

// Load all files from the api directory
const apiDir = path.join(__dirname, 'api');
if (fs.existsSync(apiDir)) {
    await loadApiRoutes(apiDir);
}

app.listen(port, () => {
    console.log(`Local API server running at http://localhost:${port}`);
});

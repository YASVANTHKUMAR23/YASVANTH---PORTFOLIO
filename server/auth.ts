import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'dev-secret-key';
const ADMIN_PASSWORD_PLAIN = process.env.ADMIN_PASSWORD || 'admin';
let ADMIN_PASSWORD_HASH: string;

// Hash password at startup
(async () => {
    ADMIN_PASSWORD_HASH = await bcrypt.hash(ADMIN_PASSWORD_PLAIN, 10);
    console.log('🔐 Admin password secure hash generated.');
})();

interface TokenPayload {
    role: string;
    iat: number;
    exp: number;
}

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export const login = async (password: string): Promise<string | null> => {
    const match = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (match) {
        const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
        return token;
    }
    return null;
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // Allow GET requests (public) - adjust if some GETs should be private
    // But requirement says "Only the admin dashboard has permission to make edits", implying GETs are public.
    if (req.method === 'GET') {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied: No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Access denied: Invalid or expired token' });
        }
        req.user = user as TokenPayload;
        next();
    });
};

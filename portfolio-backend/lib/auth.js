import { supabaseAdmin } from './supabase.js'

export async function authenticateUser(req, res, next) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Missing or invalid authorization header'
            })
        }

        const token = authHeader.replace('Bearer ', '')

        // Verify token with Supabase
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            })
        }

        // Attach user to request
        req.user = user
        return next()
    } catch (error) {
        console.error('Auth middleware error:', error)
        return res.status(500).json({
            success: false,
            error: 'Authentication failed'
        })
    }
}

import { supabase } from '../../../lib/supabase.js'
import { setCorsHeaders } from '../../../lib/cors.js'
import { successResponse, errorResponse } from '../../../utils/response.js'

export default async function handler(req, res) {
    if (setCorsHeaders(req, res)) return

    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' })
        }

        const { email, password } = req.body

        if (!email || !password) {
            return errorResponse(res, 'Email and password are required', 422)
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            return errorResponse(res, error)
        }

        return successResponse(res, data, 'Login successful')
    } catch (error) {
        console.error('Auth API error:', error)
        return errorResponse(res, error, 500)
    }
}

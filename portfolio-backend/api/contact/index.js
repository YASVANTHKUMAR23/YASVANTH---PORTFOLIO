import { supabaseAdmin } from '../../lib/supabase.js'
import { rateLimit } from '../../lib/rateLimit.js'
import { setCorsHeaders } from '../../lib/cors.js'
import { successResponse, errorResponse } from '../../utils/response.js'

// Rate limit: 5 submissions per hour from same IP
const contactRateLimit = rateLimit(3600000, 5)

export default async function handler(req, res) {
    if (setCorsHeaders(req, res)) return

    try {
        if (req.method === 'POST') {
            return await contactRateLimit(req, res, () => submitContactForm(req, res))
        } else {
            return res.status(405).json({ error: 'Method not allowed' })
        }
    } catch (error) {
        console.error('Contact API error:', error)
        return errorResponse(res, error, 500)
    }
}

async function submitContactForm(req, res) {
    const { name, email, subject, message, phone, company } = req.body

    if (!name || !email || !message) {
        return errorResponse(res, 'Missing required fields: name, email, message', 422)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return errorResponse(res, 'Invalid email format', 422)
    }

    const { data, error } = await supabaseAdmin
        .from('contact')
        .insert([{
            name,
            email,
            subject,
            message,
            phone,
            company,
            status: 'new'
        }])
        .select()
        .single()

    if (error) {
        return errorResponse(res, error)
    }

    return successResponse(res, data, 'Message sent successfully', 201)
}

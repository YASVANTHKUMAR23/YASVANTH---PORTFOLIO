import { supabase, supabaseAdmin } from '../../lib/supabase.js'
import { authenticateUser } from '../../lib/auth.js'
import { setCorsHeaders } from '../../lib/cors.js'
import { successResponse, errorResponse } from '../../utils/response.js'

export default async function handler(req, res) {
    if (setCorsHeaders(req, res)) return

    try {
        switch (req.method) {
            case 'GET':
                return await getStats(req, res)
            case 'POST':
                return await authenticateUser(req, res, () => updateStats(req, res))
            default:
                return res.status(405).json({ error: 'Method not allowed' })
        }
    } catch (error) {
        console.error('Stats API error:', error)
        return errorResponse(res, error, 500)
    }
}

async function getStats(req, res) {
    const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('display_order', { ascending: true })

    if (error) {
        return errorResponse(res, error)
    }

    return successResponse(res, data)
}

async function updateStats(req, res) {
    const statsArray = req.body // Expecting an array of stats

    if (!Array.isArray(statsArray)) {
        return errorResponse(res, 'Input must be an array of stats', 422)
    }

    // Simple implementation: delete and re-insert or update individually
    // For simplicity here, we'll just handle it as a bulk update if IDs exist
    const errors = []
    const results = []

    for (const item of statsArray) {
        const { id, ...payload } = item
        let result;
        if (id) {
            result = await supabaseAdmin.from('stats').update(payload).eq('id', id).select()
        } else {
            result = await supabaseAdmin.from('stats').insert([payload]).select()
        }
        if (result.error) errors.push(result.error)
        else results.push(result.data[0])
    }

    if (errors.length > 0) {
        return errorResponse(res, errors[0])
    }

    return successResponse(res, results, 'Stats updated successfully')
}

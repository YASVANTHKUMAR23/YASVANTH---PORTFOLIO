import { supabase, supabaseAdmin } from '../../lib/supabase.js'
import { authenticateUser } from '../../lib/auth.js'
import { setCorsHeaders } from '../../lib/cors.js'
import { successResponse, errorResponse } from '../../utils/response.js'

export default async function handler(req, res) {
    if (setCorsHeaders(req, res)) return

    try {
        switch (req.method) {
            case 'GET':
                return await getAbout(req, res)
            case 'POST':
                return await authenticateUser(req, res, () => updateAbout(req, res))
            case 'PUT':
                return await authenticateUser(req, res, () => updateAbout(req, res))
            default:
                return res.status(405).json({ error: 'Method not allowed' })
        }
    } catch (error) {
        console.error('About API error:', error)
        return errorResponse(res, error, 500)
    }
}

async function getAbout(req, res) {
    const { data, error } = await supabase
        .from('about')
        .select('*')
        .eq('is_active', true)
        .single()

    if (error && error.code !== 'PGRST116') {
        return errorResponse(res, error)
    }

    return successResponse(res, data || {})
}

async function updateAbout(req, res) {
    const aboutData = req.body

    if (!aboutData.heading || !aboutData.bio) {
        return errorResponse(res, 'Heading and bio are required', 422)
    }

    if (aboutData.is_active) {
        await supabaseAdmin
            .from('about')
            .update({ is_active: false })
            .neq('id', aboutData.id || '00000000-0000-0000-0000-000000000000')
    }

    const { id, ...dataToUpdate } = aboutData

    let result;
    if (id) {
        result = await supabaseAdmin
            .from('about')
            .update(dataToUpdate)
            .eq('id', id)
            .select()
            .single()

        if (result.error && result.error.code === 'PGRST116') {
            result = await supabaseAdmin
                .from('about')
                .insert([dataToUpdate])
                .select()
                .single()
        }
    } else {
        result = await supabaseAdmin
            .from('about')
            .insert([dataToUpdate])
            .select()
            .single()
    }

    if (result.error) {
        console.error('About update error:', result.error)
        return errorResponse(res, result.error)
    }

    return successResponse(res, result.data, 'About section updated successfully')
}

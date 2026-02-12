import { supabase, supabaseAdmin } from '../../lib/supabase.js'
import { authenticateUser } from '../../lib/auth.js'
import { setCorsHeaders } from '../../lib/cors.js'
import { successResponse, errorResponse } from '../../utils/response.js'

export default async function handler(req, res) {
    if (setCorsHeaders(req, res)) return

    try {
        switch (req.method) {
            case 'GET':
                return await getHero(req, res)
            case 'POST':
                return await authenticateUser(req, res, () => updateHero(req, res))
            case 'PUT':
                return await authenticateUser(req, res, () => updateHero(req, res))
            default:
                return res.status(405).json({ error: 'Method not allowed' })
        }
    } catch (error) {
        console.error('Hero API error:', error)
        return errorResponse(res, error, 500)
    }
}

async function getHero(req, res) {
    const { data, error } = await supabase
        .from('hero')
        .select('*')
        .eq('is_active', true)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        return errorResponse(res, error)
    }

    return successResponse(res, data || {})
}

async function updateHero(req, res) {
    const heroData = req.body

    if (!heroData.title) {
        return errorResponse(res, 'Title is required', 422)
    }

    // If this is active, deactivate others (Supabase index enforces only one active if we want, but let's be explicit)
    if (heroData.is_active) {
        await supabaseAdmin
            .from('hero')
            .update({ is_active: false })
            .neq('id', heroData.id || '00000000-0000-0000-0000-000000000000')
    }

    const { id, ...dataToUpdate } = heroData

    let result;
    if (id) {
        result = await supabaseAdmin
            .from('hero')
            .update(dataToUpdate)
            .eq('id', id)
            .select()
            .single()

        if (result.error && result.error.code === 'PGRST116') {
            result = await supabaseAdmin
                .from('hero')
                .insert([dataToUpdate])
                .select()
                .single()
        }
    } else {
        result = await supabaseAdmin
            .from('hero')
            .insert([dataToUpdate])
            .select()
            .single()
    }

    if (result.error) {
        console.error('Hero update error:', result.error)
        return errorResponse(res, result.error)
    }

    return successResponse(res, result.data, 'Hero section updated successfully')
}

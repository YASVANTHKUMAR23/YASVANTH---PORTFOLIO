import { supabase, supabaseAdmin } from '../../lib/supabase.js'
import { authenticateUser } from '../../lib/auth.js'
import { setCorsHeaders } from '../../lib/cors.js'
import { successResponse, errorResponse } from '../../utils/response.js'

export default async function handler(req, res) {
    if (setCorsHeaders(req, res)) return

    try {
        switch (req.method) {
            case 'GET':
                return await getProjects(req, res)
            case 'POST':
                return await authenticateUser(req, res, () => upsertProject(req, res))
            case 'PUT':
                return await authenticateUser(req, res, () => upsertProject(req, res))
            default:
                return res.status(405).json({ error: 'Method not allowed' })
        }
    } catch (error) {
        console.error('Projects API error:', error)
        return errorResponse(res, error, 500)
    }
}

async function getProjects(req, res) {
    const { category, featured, limit = 50, offset = 0 } = req.query

    let query = supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

    if (category) {
        query = query.eq('category', category)
    }

    if (featured === 'true') {
        query = query.eq('featured', true)
    }

    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    const { data, error, count } = await query

    if (error) {
        return errorResponse(res, error)
    }

    return successResponse(res, {
        projects: data,
        pagination: {
            total: count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        }
    })
}

async function upsertProject(req, res) {
    const projectData = req.body

    if (!projectData.title || !projectData.slug) {
        return errorResponse(res, 'Missing required fields: title, slug', 422)
    }

    const { id, ...payload } = {
        ...projectData,
        status: projectData.status || 'completed',
        featured: projectData.featured || false,
        display_order: projectData.display_order || 0,
        is_published: projectData.is_published !== undefined ? projectData.is_published : true
    }

    let result;
    if (id) {
        // Try update first
        result = await supabaseAdmin
            .from('projects')
            .update(payload)
            .eq('id', id)
            .select()
            .single()

        // If updating by ID fails because the ID doesn't exist, try upserting by slug
        if (result.error && result.error.code === 'PGRST116') {
            result = await supabaseAdmin
                .from('projects')
                .upsert([{ ...payload, slug: payload.slug || projectData.slug }], { onConflict: 'slug' })
                .select()
                .single()
        }
    } else {
        result = await supabaseAdmin
            .from('projects')
            .upsert([payload], { onConflict: 'slug' })
            .select()
            .single()
    }

    if (result.error) {
        console.error('Projects upsert error:', result.error)
        return errorResponse(res, result.error)
    }

    return successResponse(res, result.data, id ? 'Project saved' : 'Project created')
}

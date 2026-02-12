import { supabase, supabaseAdmin } from '../../lib/supabase.js'
import { authenticateUser } from '../../lib/auth.js'
import { setCorsHeaders } from '../../lib/cors.js'
import { successResponse, errorResponse } from '../../utils/response.js'

export default async function handler(req, res) {
    if (setCorsHeaders(req, res)) return

    try {
        switch (req.method) {
            case 'GET':
                return await getBlogs(req, res)
            case 'POST':
                return await authenticateUser(req, res, () => upsertBlog(req, res))
            case 'PUT':
                return await authenticateUser(req, res, () => upsertBlog(req, res))
            default:
                return res.status(405).json({ error: 'Method not allowed' })
        }
    } catch (error) {
        console.error('Blogs API error:', error)
        return errorResponse(res, error, 500)
    }
}

async function getBlogs(req, res) {
    const { category, featured, limit = 50, offset = 0 } = req.query

    let query = supabase
        .from('blogs')
        .select('*', { count: 'exact' })
        .eq('is_published', true)
        .order('published_at', { ascending: false })

    if (category) {
        query = query.eq('category', category)
    }

    if (featured === 'true') {
        query = query.eq('is_featured', true)
    }

    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    const { data, error, count } = await query

    if (error) {
        return errorResponse(res, error)
    }

    return successResponse(res, {
        blogs: data,
        pagination: {
            total: count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        }
    })
}

async function upsertBlog(req, res) {
    const blogData = req.body

    if (!blogData.title || !blogData.slug || !blogData.content) {
        return errorResponse(res, 'Missing required fields: title, slug, content', 422)
    }

    const { id, ...dataToUpdate } = blogData

    let result;
    if (id) {
        result = await supabaseAdmin
            .from('blogs')
            .update(dataToUpdate)
            .eq('id', id)
            .select()
            .single()

        if (result.error && result.error.code === 'PGRST116') {
            result = await supabaseAdmin
                .from('blogs')
                .upsert([{
                    ...dataToUpdate,
                    is_featured: blogData.is_featured || false,
                    is_published: blogData.is_published || false,
                    published_at: dataToUpdate.published_at || (blogData.is_published ? new Date().toISOString() : null)
                }], { onConflict: 'slug' })
                .select()
                .single()
        }
    } else {
        result = await supabaseAdmin
            .from('blogs')
            .upsert([{
                ...dataToUpdate,
                is_featured: blogData.is_featured || false,
                is_published: blogData.is_published || false,
                published_at: dataToUpdate.published_at || (blogData.is_published ? new Date().toISOString() : null)
            }], { onConflict: 'slug' })
            .select()
            .single()
    }

    if (result.error) {
        console.error('Blogs upsert error:', result.error)
        return errorResponse(res, result.error)
    }

    return successResponse(res, result.data, id ? 'Blog post updated' : 'Blog post created', id ? 200 : 201)
}

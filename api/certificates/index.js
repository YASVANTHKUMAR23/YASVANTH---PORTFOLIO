import { supabase, supabaseAdmin } from '../../lib/supabase.js'
import { authenticateUser } from '../../lib/auth.js'
import { setCorsHeaders } from '../../lib/cors.js'
import { successResponse, errorResponse } from '../../utils/response.js'

export default async function handler(req, res) {
    if (setCorsHeaders(req, res)) return

    try {
        switch (req.method) {
            case 'GET':
                return await getCertificates(req, res)
            case 'POST':
                return await authenticateUser(req, res, () => upsertCertificate(req, res))
            case 'PUT':
                return await authenticateUser(req, res, () => upsertCertificate(req, res))
            default:
                return res.status(405).json({ error: 'Method not allowed' })
        }
    } catch (error) {
        console.error('Certificates API error:', error)
        return errorResponse(res, error, 500)
    }
}

async function getCertificates(req, res) {
    let query = supabase
        .from('certificates')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .order('issue_date', { ascending: false })

    const { data, error } = await query

    if (error) {
        return errorResponse(res, error)
    }

    return successResponse(res, data)
}

async function upsertCertificate(req, res) {
    const certData = req.body

    if (!certData.title || !certData.issuer || !certData.issue_date) {
        return errorResponse(res, 'Missing required fields: title, issuer, issue_date', 422)
    }

    const { id, ...dataToUpdate } = certData

    let result;
    if (id) {
        result = await supabaseAdmin
            .from('certificates')
            .update(dataToUpdate)
            .eq('id', id)
            .select()
            .single()

        if (result.error && result.error.code === 'PGRST116') {
            result = await supabaseAdmin
                .from('certificates')
                .insert([{
                    ...dataToUpdate,
                    is_featured: certData.is_featured || false,
                    display_order: certData.display_order || 0,
                    is_published: certData.is_published !== undefined ? certData.is_published : true
                }])
                .select()
                .single()
        }
    } else {
        result = await supabaseAdmin
            .from('certificates')
            .insert([{
                ...dataToUpdate,
                is_featured: certData.is_featured || false,
                display_order: certData.display_order || 0,
                is_published: certData.is_published !== undefined ? certData.is_published : true
            }])
            .select()
            .single()
    }

    if (result.error) {
        console.error('Certificates upsert error:', result.error)
        return errorResponse(res, result.error)
    }

    return successResponse(res, result.data, id ? 'Certificate updated' : 'Certificate added', id ? 200 : 201)
}

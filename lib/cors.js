export const corsConfig = {
    origin: process.env.NODE_ENV === 'production'
        ? [
            'https://your-portfolio-domain.com', // Update this with actual domain
            'https://www.your-portfolio-domain.com'
        ]
        : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
}

export function setCorsHeaders(req, res) {
    const origin = req.headers.origin

    if (corsConfig.origin.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin)
    }

    res.setHeader('Access-Control-Allow-Methods', corsConfig.methods.join(', '))
    res.setHeader('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '))
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Max-Age', corsConfig.maxAge.toString())

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return true
    }

    return false
}

const requestCounts = new Map()

export function rateLimit(windowMs = 60000, maxRequests = 10) {
    return (req, res, next) => {
        const identifier = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const now = Date.now()
        const windowStart = now - windowMs

        // Clean old entries
        if (requestCounts.has(identifier)) {
            const requests = requestCounts.get(identifier).filter(time => time > windowStart)
            requestCounts.set(identifier, requests)
        } else {
            requestCounts.set(identifier, [])
        }

        const requests = requestCounts.get(identifier)

        if (requests.length >= maxRequests) {
            return res.status(429).json({
                success: false,
                error: 'Too many requests. Please try again later.'
            })
        }

        requests.push(now)
        requestCounts.set(identifier, requests)

        return next()
    }
}

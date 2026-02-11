export function successResponse(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    })
}

export function errorResponse(res, error, statusCode = 400) {
    return res.status(statusCode).json({
        success: false,
        error: typeof error === 'string' ? error : error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    })
}

export function validationErrorResponse(res, errors) {
    return res.status(422).json({
        success: false,
        error: 'Validation failed',
        errors
    })
}

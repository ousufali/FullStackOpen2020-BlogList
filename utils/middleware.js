const logger = require('./logger')
const { response } = require('../app')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', req.body)
    logger.info('-----')

    next()

}

const unknownEndPoint = (request, response) => {
    response.status(400).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformed id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })

    }
    else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'invalid token' })
    }

    logger.error(error.message)
    next(error)
}
module.exports = {
    requestLogger, unknownEndPoint, errorHandler
}
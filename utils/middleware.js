const logger = require('./logger')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', req.body)
    logger.info('-----')

    next()

}

const unknownEndPoint = (request, response) => {
    response.status(400).send({ erroe: 'Unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {

    logger.error(`ErrorMessage:: ${error.message}`)

    if (error.name === 'CastError') {
        response.status(400).send({ error: 'Malformed id.' })
    } else if (error.name === 'ValidationError')
    {
        response.status(400).json({error : error.message})
    }
    next(error)
}
module.exports = {
    requestLogger, unknownEndPoint, errorHandler
}
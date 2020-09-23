const Blog = require('../models/blog')
const blogrouter = require('express').Router()


blogrouter
    .get('/', (request, response) => {
        Blog.find({})
            .then((blogs) => response.json(blogs))
    })

blogrouter
    .post('/', (request, response) => {
        const blog = new Blog(request.body)

        blog
            .save()
            .then(result => response.status(201).json(result))
    })

module.exports =  blogrouter 
const { endsWith } = require('lodash')
const Blog = require('../models/blog')
const blogrouter = require('express').Router()


blogrouter
    .get('/', async (request, response) => {
        const blogs = await Blog.find({})
        // console.log("blogs returned in test:")
        // console.log(blogs)
        response.json(blogs)
        // Blog.find({})
        //     .then((blogs) => response.json(blogs))
    })

blogrouter
    .post('/', (request, response) => {
        const newblog = request.body

        if (!newblog.title || !newblog.url) {
            // console.log(".......................")
            // console.log("RETURNING..")
            // console.log(".......................")

            return response.status(400).json({ error: "Bad Request" })
        } else {
            const blog = new Blog({
                title: newblog.title,
                author: newblog.author,
                url: newblog.url,
                likes: newblog.likes || 0
            })


            blog
                .save()
                .then(result => response.status(201).json(result))

        }
    })

blogrouter
    .delete('/:id', async (request, response, next) => {
        try {
            await Blog.findByIdAndRemove(request.params.id)
            response.status(204).end()
        }
        catch (exception) {
            next(exception)
        }
    })

blogrouter
    .put('/:id', async (request, response, next) => {
        try {
            const blogs = await Blog.find({})
            let obj
            blogs.forEach(x => {
                if (x.id === request.params.id) {
                    obj = x
                }
            });
            // console.log("...............OBJ..................")
            // console.log(obj)
            // console.log("..................................")
            const updateObj = { title: obj.title,author: obj.author,url:obj.url, likes :  10000,}
            // console.log(".............updated..OBJ..................")
            // console.log(updateObj)
            // console.log("..................................")
            

            const updatedBlog =  await Blog.findByIdAndUpdate(request.params.id, updateObj, {new: true})
            return response.json(updatedBlog)

            


        } catch (exception) {
            next(exception)
        }
    })

module.exports = blogrouter 
const { endsWith } = require('lodash')
const Blog = require('../models/blog')
const blogrouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

blogrouter
    .get('/', async (request, response) => {
        const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
        response.json(blogs)
    })

blogrouter
    .post('/', async (request, response) => {
        const body = request.body

        const token = getTokenFrom(request)
        const decodedToken = await jwt.verify(token, process.env.SECRET)


        if (!token || !decodedToken) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const user = await User.findById(decodedToken.id)

        console.log("............user...............")
        console.log(decodedToken)
        console.log(decodedToken.id)
        console.log(user)
        console.log("...........END...user...............")


        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user.id
        })

        const savedblog = await blog.save()
        user.blogs = user.blogs.concat(savedblog.id)
        await user.save()

        response.status(200).json(savedblog)







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
            const updateObj = { title: obj.title, author: obj.author, url: obj.url, likes: 10000, }
            // console.log(".............updated..OBJ..................")
            // console.log(updateObj)
            // console.log("..................................")


            const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updateObj, { new: true })
            return response.json(updatedBlog)




        } catch (exception) {
            next(exception)
        }
    })

module.exports = blogrouter 
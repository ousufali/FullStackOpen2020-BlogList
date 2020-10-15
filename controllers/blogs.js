const { endsWith } = require('lodash')
const Blog = require('../models/blog')
const blogrouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// const getTokenFrom = (request) => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//         return authorization.substring(7)
//     }
//     return null
// }

blogrouter
    .get('/', async (request, response) => {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
        response.json(blogs)
    })

blogrouter
    .post('/', async (request, response) => {
        const body = request.body
        console.log("............request...............")
        // console.log(request)
        console.log(request.body)
        // console.log(request.token)
        console.log("...........END...request...............")

        // const token = getTokenFrom(request)
        const decodedToken = await jwt.verify(request.token, process.env.SECRET)


        if (!decodedToken) {
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

    })

blogrouter
    .delete('/:id', async (request, response) => {
        console.log("..........DELETE................")

        const decodedToken = await jwt.verify(request.token, process.env.SECRET)
        console.log("decoded token:  ", decodedToken)
        if (!decodedToken) {
            return response.status(401).json({ error: "invalid or missing token" })
        }

        const blogToDelete = await Blog.findById(request.params.id)
        console.log("blog to delete:   ",blogToDelete)

        if (blogToDelete.user.toString() === decodedToken.id.toString()) {
            await Blog.findByIdAndRemove(request.params.id)
            response.status(204).end()
        } else {
            return response.status(401).json({ error: "authentication failed, invalid user" })
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
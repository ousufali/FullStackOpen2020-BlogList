const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')


userRouter
    .get('/', async (request, response) => {
        const users = await User.find({}).populate('blogs', { title: 1, author: 1 })
        response.status(200).json(users)
    })

userRouter
    .post('/', async (request, response) => {
        const body = request.body
        if (body.password === undefined) {
            return response.status(400).json({ error: 'password missing' })
        }
        const saltRound = 10
        const passwordHash = await bcrypt.hash(body.password, saltRound)

        const user = new User({
            name: body.name,
            username: body.username,
            passwordHash
        })

        const saveduser = await user.save()
        response.json(saveduser)
    })

module.exports = userRouter
const User = require('../models/user')
const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { request, response } = require('express')

loginRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findOne({ username: body.username })

    if(body.password === undefined)
    {
        return response.status(400).json({error: 'password missing'})
    }

    const passwordCorrect = user === null ? false : bcrypt.compare(body.password, user.passwordHash)

    if (!user || !passwordCorrect) {
        return response.status(401).json({ error: 'invalid username or password' })
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
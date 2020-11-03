const User = require('../models/user')
const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { request, response } = require('express')

loginRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findOne({ username: body.username })
    console.log("found user:   ", user)

    if (body.password === undefined) {
        return response.status(400).json({ error: 'password missing' })
    }

    // console.log("body.password:  ", body.password)
    const passwordCorrect = (user === null ? false : await bcrypt.compare(body.password, user.passwordHash))
  

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
        .send({ token, username: user.username, name: user.name,id : user.id })
})

module.exports = loginRouter
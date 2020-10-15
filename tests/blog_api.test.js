const helper = require('./test_helper')
const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')

const api = supertest(app)

const Blog = require('../models/blog')
const test_helper = require('../../backend_part/test/test_helper')
const { before } = require('lodash')
const { Mongoose } = require('mongoose')
const blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // console.log("before each ...............")
    await api.post('/api/users')
        .send({
            "name": "admin",
            "username": "root",
            "password": "admin"
        })

    const blogsobjects = helper.initialBlogs.map((x) => new Blog(x))
    const promiseArray1 = blogsobjects.map(x => x.save())

    await Promise.all(promiseArray1)


    // console.log("END......before each ...............")

})

describe('if blogs in database', () => {

    test('all blogs returned in JSON formate', async () => {
        await
            api.get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)


    })
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        console.log(".................body[0]")
        console.log(response.body[0])

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    test('ID verifying', async () => {
        const response = await api.get('/api/blogs')
        console.log("body:.......")
        console.log(response.body)

        const blogs = response.body
        blogs.forEach(x => expect(x.id).toBeDefined())
    })
})

describe('adding blog in DB', () => {

    test('successful post request', async () => {

        const userInDb = await helper.usersInDb()
        console.log("..............USER in DB............................")
        console.log("userinDB:   ", userInDb)
        console.log("..............USER in DB.......END.....................")


        const rootTokenObject = await api.post('/api/login')
            .send({ username: userInDb[0].username, password: "admin" })

        console.log("roottokenobject token:   ", rootTokenObject.body.token)

        const newblog = {
            title: "No work",
            author: "nobody",
            url: "google.com/",
            likes: 0,
            user: userInDb.id
        }

        await api.post('/api/blogs')
            .send(newblog)
            .set('Authorization', `bearer ${rootTokenObject.body.token}`)
            .expect(200)
            .expect('Content-type', /application\/json/)

        const blogsafterpost = await helper.blogsInDB()
        expect(blogsafterpost).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsafterpost.map(x => x.title)
        expect(titles).toContain(newblog.title)
    })

    test.only('Unauthorized, token is not provided', async () => {

        // const userInDb = await helper.usersInDb()


        // const rootTokenObject = await api.post('/api/login')
        //     .send({ username: "root", password: "admin" })

        const token = null

        const newblog = {
            title: "No work",
            author: "nobody",
            url: "google.com/",
            likes: 0,
            user: "root"
        }

        const result = await api.post('/api/blogs')
            .send(newblog)
            .set('Authorization', `bearer ${null}`)
            .expect(401)
    
            expect(result.body.error).toEqual('invalid token')

        const blogsafterpost = await helper.blogsInDB()
        expect(blogsafterpost).toHaveLength(helper.initialBlogs.length)

    })

    test('If blog is missing likes, default will be 0. ', async () => {

        const newblog = {
            title: "No work",
            author: "yousuf ali",
            url: "google.com/",
        }

        await api.post('/api/blogs')
            .send(newblog)
            .expect(201)
            .expect('Content-type', /application\/json/)

        const blogsafterpost = await helper.blogsInDB()
        expect(blogsafterpost).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsafterpost.map(x => x.title)
        expect(titles).toContain(newblog.title)

        let id = "none"
        await blogsafterpost.forEach(x => {
            if (x.title === newblog.title) {
                id = x.id
            }
        })

        expect(blogsafterpost).toContainEqual({ ...newblog, likes: 0, id: id })
    })

    test('If blog is missing title and url, 400 bad request. ', async () => {

        const newblog = {

            author: "yousuf ali",
            likes: 100,
            title: "No work",
        }

        await api.post('/api/blogs')
            .send(newblog)
            .expect(400)


    })

})
describe('Deleteing a ablog', () => {
    test('delete blog with id', async () => {

        const blogs = await helper.blogsInDB()

        let id = "none"
        await blogs.forEach(x => {
            if (x.title === helper.initialBlogs[0].title) {
                id = x.id
            }
        })

        await api.delete(`/api/blogs/${id}`)
            .expect(204)
            .expect(error.name)

    })
})



describe('Users creation', () => {

    test('invalid user are not created', async () => {
        const userBeforePost = await helper.usersInDb()
        const newUser = {
            naem: 'akram',
            username: 'alishah'
        }

        const result = await api.post('/api/users')
            .send(newUser)
            .expect(400)

        expect(result.body.error).toContain("password missing")

        const userAfterPost = await helper.usersInDb()

        expect(userAfterPost.length).toBe(userBeforePost.length)
    })
})


afterAll(
    () => {
        mongoose.connection.close()
    }
)
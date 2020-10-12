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

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogsobjects = helper.initialBlogs.map((x) => new Blog(x))
    const promiseArray = blogsobjects.map(x => x.save())

    await Promise.all(promiseArray)

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

        const newblog = {
            title: "No work",
            author: "yousuf ali",
            url: "google.com/",
            likes: 0,
        }

        await api.post('/api/blogs')
            .send(newblog)
            .expect(201)
            .expect('Content-type', /application\/json/)

        const blogsafterpost = await helper.blogsInDB()
        expect(blogsafterpost).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsafterpost.map(x => x.title)
        expect(titles).toContain(newblog.title)
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

    describe('Deleteing a ablog', () => {
        test.only('delete blog with id', async () => {
           
        const blogs = await helper.blogsInDB()

        let id = "none"
        await blogs.forEach(x => {
            if (x.title === helper.initialBlogs[0].title) {
                id = x.id
            }
        })

            await api.delete(`/api/blogs/${id}`)
            .expect(204)

        })
    })


})

afterAll(
    () => {
        mongoose.connection.close()
    }
)
const { model } = require('../models/blog')
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    },

    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 3,
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 10,
    },
]


const blogsInDB = async ()=>{
    const blogs = await Blog.find({})
   
    // console.log(".................")
    // console.log("blogs in db during test.")
    // console.log(blogs)
    // console.log(".................")
    
    return blogs.map((x)=>x.toJSON())
}

module.exports =
{
    initialBlogs, blogsInDB
} 

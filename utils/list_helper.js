const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}
const count_likes = (blogs) => {
    const reducer = (accumalator, currentvale) => accumalator + currentvale.likes
    const result = blogs.reduce(reducer, 0)
    return result
}

const favoriteBlog = (blogs) => {
    var maxLikes = 0
    for (var i = 0; i < blogs.length; i++) {
        if (maxLikes < blogs[i].likes) {
            maxLikes = blogs[i].likes
        }
    }
    const resultObject = blogs.find(obj => obj.likes === maxLikes)

    return result = {
        title: resultObject.title,
        author: resultObject.author,
        likes: resultObject.likes
    }

}

const mostBlog = (Blogs) => {
    var maxauthor = []
    const blogarray = lodash.groupBy(Blogs, 'author')
    // console.log(`blog array Authors:::   `) 
    // console.log(blogarray)
    // console.log('..............................')

    lodash.map(blogarray, author => {
        // console.log(`author.length:   ${author.length}`)
        // console.log(`maxauthor.length:   ${maxauthor.length}`)

        if (author.length > maxauthor.length) {
            // console.log(`author:  `)
            // console.log(author)
            // console.log(`maxauthor:   `)
            // console.log(maxauthor)
            // console.log('..............................')

            maxauthor = author

        }

    })

    return {
        author: maxauthor[0].author,
        blogs_count: maxauthor.length
    }

}

const mostLikes = (Blogs) => {
    var maxLikeAuthor = []
    var likesCount = 0;

    const authors = lodash.groupBy(Blogs, 'author')
    lodash.map(authors, (author) => {
        var count_likes = 0
        for (var i = 0; i < author.length; i++) {
            count_likes += author[i].likes

        }
        if(likesCount < count_likes)
        {
            likesCount = count_likes
            maxLikeAuthor = author
        }

    })

    return {
        author: maxLikeAuthor[0].author,
        likes: likesCount
    }

}


module.exports = {
    dummy,
    count_likes,
    favoriteBlog,
    mostBlog,
    mostLikes
}
const express = require('express')
const bodyParser = require('body-parser')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

// Create server
const app = express()
app.use(bodyParser.json())

// Create database instance and start server
const adapter = new FileAsync('db.json')
low(adapter)
    .then(db => {
        // Routes

        // GET
        // GET /posts
        app.get('/posts', (req, res) => {
            const userId = req.query.userId
            let posts = undefined
            if (userId) {
                posts = db.get('posts')
                    .filter({userId: +userId})
                    .value()
            } else {
                posts = db.get('posts')
                    .value()
            }

            res.send(posts)
        })

        // GET /posts/:id
        app.get('/posts/:id', (req, res) => {
            const post = db.get('posts')
                .find({ id: +req.params.id })
                .value()

            res.send(post)
        })

        // GET /posts/:id/comments
        app.get('/posts/:id/comments', (req, res) => {
            const comments = db.get('comments')
                .filter({postId: +req.params.id})
                .value()

            res.send(comments)
        })

        // GET /comments
        app.get('/comments', (req, res) => {
            const postId = req.query.postId
            let comments = undefined
            if (postId) {
                comments = db.get('comments')
                    .filter({postId: +postId})
                    .value()
            } else {
                comments = db.get('comments')
                    .value()
            }
            res.send(comments)
        })

        // GET /users
        app.get('/users', (req, res) => {
            const users = db.get('users')
                    .value()

            res.send(users)
        })



        // POST
        // POST /posts
        app.post('/posts', (req, res) => {
            db.get('posts')
                .push(req.body)
                .last()
                .assign({ id: Date.now().toString() })
                .write()
                .then(post => res.send(post))
        })

        // Set db default values
        return db.defaults({ posts: [] }).write()
    })
    .then(() => {
        app.listen(3000, () => console.log('listening on port 3000'))
    })
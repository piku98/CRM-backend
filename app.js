const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const userrouter = require('./routes/userroutes')
const contactsrouter = require('./routes/contactroutes')
require('dotenv').config()


//db initialize
require('./controllers/dbinit')


//body parser
const jsonparser = bodyparser.json()
const urlparser = bodyparser.urlencoded({ extended: false })
app.use(jsonparser)
app.use(urlparser)



app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'hey man!' })
})


//routes
app.use('/api/user', userrouter)
app.use('/api/contacts', contactsrouter)



//for 404 errors
app.use((req, res, next) => {
    let err = new Error('404 page not found.')
    next(err)
})


//error handler
app.use((err, req, res, next) => {
    if (err.message === '404 page not found.') {
        console.log(err.message)
        res.status(404).json({ success: false, error: 'Page not found' })
    } else if (err instanceof SyntaxError) {
        console.log(err.message)
        res.status(400).json({ success: false, error: err.message })
    } else {
        console.log(err)
        res.status(500).json({ success: false, error: 'Internal server error' })
    }
    next()
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server has started at ${PORT}`)
})
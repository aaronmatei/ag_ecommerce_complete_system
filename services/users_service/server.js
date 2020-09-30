const express = require('express')
const morgan = require('morgan')
const connectDB = require('./config/db')

const app = express()

//connect to database 
connectDB()


const cors = require('cors')
require('dotenv').config()

const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors({ origin: `http://localhost:3000` }))

//use JWT auth to secure the api


//middleware 



// Define Routes
const authRoutes = require('./routes/api/auth')
app.use('/api/v1/users', authRoutes);


//global error handler 


//start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000
const server = app.listen(port, function () {
    console.log(`listening to port ${port}`)
})
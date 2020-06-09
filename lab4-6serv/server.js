const express = require('express')
const connectDb = require('./config/db')
const path = require('path')

const expressLogging = require('express-logging')
const logger = require('logops')


const PORT = process.env.PORT || 5000
const app = express()

// Connect Database
connectDb()

app.use(expressLogging(logger))
app.use(express.json({ extended: false }))

// Define Routes
app.use('/api/data', require('./routes/api/data'))
app.use('/api/replication', require('./routes/api/replication'))


app.listen(PORT, () => console.log(`Server is running ${PORT}`))




const express = require('express')
const connectDb = require('./config/db')
const path = require('path')

const PORT = process.env.PORT || 5001
const app = express()

// Connect Database
connectDb()

app.use(express.json({ extended: false }))

// Define Routes
app.use('/api/data', require('./routes/api/data'))
app.use('/api/replication', require('./routes/api/replication'))


app.listen(PORT, () => console.log(`Client 1 is running ${PORT}`))




const mongoose = require('mongoose')
const Schema = mongoose.Schema


const DataSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Data = mongoose.model('dataclient2', DataSchema)


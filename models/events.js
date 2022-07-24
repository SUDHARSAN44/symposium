const mongoose = require("mongoose")
const Schema=mongoose.Schema

const eventSchema = Schema({
    name:String,
    desc:String,
    url:String,
    s_date:Date,
    e_date:Date,
    date:Date
})

module.exports = mongoose.model('events',eventSchema)
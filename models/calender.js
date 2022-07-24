const mongoose = require("mongoose")
const Schema=mongoose.Schema
const user = require('./user')
const event = require('./events')

const calenderSchema = Schema({
    user:{type:Schema.Types.ObjectId,ref:'user'},
    events:{type:Schema.Types.ObjectId,ref:'event'},
    date: {
        type: Date,
        default:async function() {
          if (this.events) {
            return await event.findById({events}).populate('event',s_date) 
          }
          return null;
        }
      }
})

module.exports = mongoose.model('calender',calenderSchema)
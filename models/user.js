const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const events = require('./events')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    id:{
        type: String,
        required: true,
        unique: true
    },
    events:[{
        
        id:{type:Schema.Types.ObjectId,
        ref:'events'
        }
    }]
});

UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('user1', UserSchema,'user1');
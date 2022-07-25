const secret = process.env.secret || 'thisshouldbeabettersecret!'
const mongoose = require('mongoose')
const express = require('express')
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const path = require('path')
const catchAsync = require('./utils/catchAsync')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const User = require('./models/user')
const events = require('./models/events')
const MongoDBStore = require("connect-mongodb-session")(session);
const admin =  require('./routes/admin')
const user =  require('./routes/user')
const {isLoggedIn} = require('./middleware/isLoggedIn')
const dotenv = require('dotenv')
const methodOverride = require('method-override');
dotenv.config()
const app = express()

app.use(express.urlencoded({extended:true}))

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

const dbUrl = process.env.dbUrl || 'mongodb+srv://sudharsan44:9952723175@symposium.r5l7tod.mongodb.net/test?retryWrites=true&w=majority'
const PORT = process.env.PORT || 710
const connectDB=async()=>{await mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true,useFindAndModify:false})}

connectDB().then(()=>{
    console.log("DB connected")
}).catch(()=>{
    console.log("DB not connected")
})

// const secret ='thisshouldbeabettersecret!';
app.use(methodOverride('_method'))
app.use(passport.initialize())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// app.use(mongosanitize({
//     replaceWith:'_'
// }))


// const store = new MongoDBStore({
//     url:dbUrl,
//     secret,
//     collection:'session',
//     touchAfter: 24 * 60 * 60
// });

// store.on("error", function (e) {
//     console.log("SESSION STORE ERROR", e)
// })



// const sessionConfig = {
//     store,
//     name:'session',
//     secret,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     }
// }
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({     
        url:dbUrl,
        secret,
        collection:'session',
        touchAfter: 24 * 60 * 60})
  }))

// app.use(session(sessionConfig));

app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))





app.use(flash());

app.use((req,res,next)=>{
    res.locals.messages = req.flash('success')
    res.locals.currentUser = req.user;
    res.locals.day=  [  "Jan", "Feb", "Mar", "Apr" , "Jun", "Jul", "Aug", "Sept", "Oct", "Nov","Dec"];
    next()
})

app.use('/admin',admin)
app.use('/user',user)


app.post('/user/register',catchAsync(async(req,res)=>{
    try{
        const data = req.body.register 
        const user = new User({name:data.name,username:data.u_name,id:data.id,email:data.email})
        const newUser = await User.register(user,data.pwd)
        console.log(newUser)
        res.redirect('/user/events')
    }
    catch(e){
        console.log(e.message)
        req.flash('success',e.message)
        res.redirect('/user/register')
    }
}))

app.post('/admin/addEvents',(req,res)=>{
    const eve = req.body.event
    const day = eve.date;
    const time = eve.s_time;
    const time2 = eve.e_time;
    const dateTime = new Date();
    const dateTime2 = new Date();

    dateTime.setFullYear(day.split('-')[0]);
    dateTime.setMonth(day.split('-')[1] - 1);
    dateTime.setDate(day.split('-')[2]);

    dateTime.setHours(time.split(':')[0]);
    dateTime.setMinutes(time.split(':')[1]);

    dateTime2.setFullYear(day.split('-')[0]);
    dateTime2.setMonth(day.split('-')[1] - 1);
    dateTime2.setDate(day.split('-')[2]);

    dateTime2.setHours(time2.split(':')[0]);
    dateTime2.setMinutes(time2.split(':')[1]);

    // get the remaining form data
    const data = new events({
        s_date: dateTime,
        e_date: dateTime2,
        desc:eve.desc,
        name: eve.name,
        url: eve.url,
        date:day
    });
    
    data.save()
    res.redirect('/admin/aevents')
})














app.listen(PORT,()=>{
    console.log(`Serving on port`,PORT)
})

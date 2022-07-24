const express = require('express')
const router = express.Router();
const events = require('../models/events')
const user = require('../models/user')
const passport = require('passport')
const { isLoggedIn } = require('../middleware/isLoggedIn');


router.get('/register',(req,res)=>{
    res.render('user/register.ejs')
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/user/register'},),async(req,res)=>{
    req.flash('success','Successfully Loggedin')
    res.redirect('/user/events')   
})

router.get('/events',isLoggedIn,async(req,res)=>{
    let c,e=[]
    const b = await user.findById(req.user._id).populate('events').then(async(e)=>{
        //console.log(e.events)
     c = await events.find({_id:{$in:e.events}})
    })
    const a = await events.find({})

    for(let d of c )
    {
        for(let f of a)
        {
        if(d._id.equals(f._id))
        e.push(d)
        }
        
    }
    res.render('user/events.ejs',{a,e})
})

router.get('/calender',isLoggedIn,async(req,res)=>{
    const b = await user.findById(req.user._id).populate('events').then(async(e)=>{
        // console.log(e.events)
        const a = await events.find({_id:{$in:e.events}})
        // console.log(a)
        res.render('user/calender.ejs',{a,messages:req.flash('success')})
        // console.log('hi')
    })
    .catch((e)=>{
        console.log(e)
    })
})


router.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err)
        {
            req.flash('error',err)
        }
    })
        req.flash('success','Bye bye')
        res.redirect('/user/register')

})

router.post('/addSchedule/:id',async(req,res)=>{
    console.log(req.user.username)
    const users =await user.findById(req.user._id)
    const data = await events.findById(req.params.id)
    let z= 10
    
    //console.log(data)
    const b = await user.findById(req.user._id).populate('events').then(async(e)=>{
        //console.log(e.events)
        const a = await events.find({_id:{$in:e.events}})
        for(let c of a)
        {
            console.log(c)
            console.log(data.date,'===',c.date)
            if(data.date.getFullYear() === c.date.getFullYear() && data.date.getMonth() === c.date.getMonth() && data.date.getDate() === c.date.getDate())
            {

                //res.redirect('/user/calender')
                z=100
            }
        
        }
      // res.render('user/calender.ejs',{a,messages:req.flash('success')})
    })
    if(z===10)
        {
        // console.log(data)
        await users.events.push(data)
        await users.save()
        // console.log(users)
        console.log('hii')
        res.redirect('/user/calender')
    }
    else{
        console.log('hi')
        req.flash('success','Sorry, You cannot add this event. You have another event scheduled on this time.')
        res.redirect('/user/events')   
    }
})

router.post('/delSchedule/:id',async(req,res)=>{
    console.log(req.user.username)

    const id = req.params.id;
    console.log("hoi",id,"G")
    const users = await user.findByIdAndUpdate(req.user._id, { $pull: { events: {_id:id} } });

    // const users =await user.findById(req.user._id)
    // const data =await events.findById(req.params.id)
    console.log('hii')
    //console.log(data)
    // await users.events.push(data)
    
    console.log(users)
    res.redirect('/user/calender')
})



module.exports = router
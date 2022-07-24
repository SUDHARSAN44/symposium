const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const events = require('../models/events')
const user = require('../models/user')
const catchAsync = require('../utils/catchAsync')

router.post('/delete/:id',async(req,res)=>{
    console.log('hiiiiiiiiiiiiiiiisadfcdicn')
    await events.findByIdAndRemove(req.params.id)
    res.redirect('/admin/aevents')
})

router.get('/calender',(req,res)=>{
    res.render('user/calender.ejs')
})


router.get('/aevents',async(req,res)=>{
    const b = await events.find({})
    res.render('admin/events.ejs',{b})
})

router.get('/addEvents',async(req,res)=>{
    res.render('admin/add.ejs')
})



router.get('/edit/:id',async(req,res)=>{
    const c = await events.findById(req.params.id)
    // let date = data.s_date
    // console.log(data)
    // let dd = toString(date.getDate())
    // let mm = toString(date.getMonth())
    // let yy = toString(date.getFullYear())
    // if(mm.length==1)
    // {
    //     mm='0'+mm
       
    // }
    // if(dd.length==1)
    // {
    //     dd='0'+dd
    // }
    // let z = yy+'-'+mm+'-'+dd
    // console.log(date.getHours())
    // let h = toString(date.getHours())
    // let m = toString(date.getMinutes())
    // if(m.length==1)
    // {
    //     m='0'+m
       
    // }
    // if(h.length==1)
    // {
    //     h='0'+h
    // }
 
    // let x = toString(h+':'+m+':'+'00')
    // console.log(x)

    // date = data.e_date
    // let h1 = date.getHours()
    // let m1 = date.getMinutes()
    // let y = h1+':'+m1
    //const c = {name:data.name,desc:data.desc,url:data.url,date:z,s_date:x,e_date:y}
    // console.log(c.date)
    res.render('admin/edit.ejs',{c})

})

router.post('/:id/edit',async(req,res)=>{
    await events.findByIdAndUpdate(req.params.id,{...req.body.event})
    res.redirect('/admin/aevents')
})





module.exports = router
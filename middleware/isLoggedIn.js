module.exports.isLoggedIn=((req,res,next)=>{
        if(!req.isAuthenticated())
        {
            req.flash('success','You must be signed in')
            return res.redirect('/user/register')
        }   
    
        next();
    })

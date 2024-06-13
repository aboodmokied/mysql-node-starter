const express=require('express');
const isAuthenticated = require('../services/authentication/middlewares/isAuthenticated');
const webRoutes=express.Router();
const authController=require('../controllers/authController');

webRoutes.post('/auth/login',authController.postLogin);
webRoutes.get('/authTest',isAuthenticated,(req,res,next)=>{
    res.send({
        session:req.session,
        user:req.user
    })
})

module.exports=webRoutes;
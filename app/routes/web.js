const express=require('express');
const isAuthenticated = require('../services/authentication/middlewares/isAuthenticated');
const webRoutes=express.Router();
const authController=require('../controllers/authController');
const pagesConfig = require('../config/pagesConfig');
const isGuest = require('../services/authentication/middlewares/isGuest');

// login
webRoutes.get(pagesConfig.authentication.login.route,isGuest,authController.getLogin);
webRoutes.post('/auth/login',isGuest,authController.postLogin);

// register
webRoutes.get(pagesConfig.authentication.register.route,isGuest,authController.getRegister);
webRoutes.post('/auth/register',isGuest,authController.postRegister);

// logout
webRoutes.get('/auth/logout',isAuthenticated,authController.logout);

webRoutes.get('/authTest',isAuthenticated,(req,res,next)=>{
    res.send({
        session:req.session,
        user:req.user
    })
})

module.exports=webRoutes;
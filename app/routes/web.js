const express=require('express');
const isAuthenticated = require('../services/authentication/middlewares/isAuthenticated');
const webRoutes=express.Router();
const authController=require('../controllers/authController');
const pagesConfig = require('../config/pagesConfig');
const isGuest = require('../services/authentication/middlewares/isGuest');
const validateRequest = require('../validation/middlewares/validateRequest');

// login
webRoutes.get(pagesConfig.authentication.login.route,isGuest,validateRequest('login-page'),authController.getLogin);
webRoutes.post('/auth/login',isGuest,validateRequest('login'),authController.postLogin);

// register
webRoutes.get(pagesConfig.authentication.register.route,isGuest,validateRequest('register-page'),authController.getRegister);
webRoutes.post('/auth/register',isGuest,validateRequest('register'),authController.postRegister);

// logout
webRoutes.get('/auth/logout',isAuthenticated,authController.logout);

webRoutes.get('/authTest',isAuthenticated,(req,res,next)=>{
    res.send({
        session:req.session,
        user:req.user
    })
})

module.exports=webRoutes;
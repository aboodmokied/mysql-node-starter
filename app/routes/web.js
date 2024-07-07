const express=require('express');
const isAuthenticated = require('../services/authentication/middlewares/isAuthenticated');
const authController=require('../controllers/web/authController');
const pagesConfig = require('../config/pagesConfig');
const isGuest = require('../services/authentication/middlewares/isGuest');
const validateRequest = require('../validation/middlewares/validateRequest');
const authorizePermission = require('../services/authorization/middlewares/authorizePermission');

const RoleController=require('../controllers/web/RoleController');

const webRoutes=express.Router();

webRoutes.get('/',(req,res,next)=>{
    res.render('authorization/starter',{
        pageTitle:'Test'
    })
})

// login
webRoutes.get(pagesConfig.authentication.login.route,isGuest,validateRequest('login-page'),authController.getLogin);
webRoutes.post('/auth/login',isGuest,validateRequest('login'),authController.postLogin);

// register
webRoutes.get(pagesConfig.authentication.register.route,isGuest,validateRequest('register-page'),authController.getRegister);
webRoutes.post('/auth/register',isGuest,validateRequest('register'),authController.postRegister);

// logout
webRoutes.get('/auth/logout',isAuthenticated,authController.logout);

webRoutes.get('/authTest',isAuthenticated,authorizePermission('testPermission1'),(req,res,next)=>{
    res.send({
        session:req.session,
        user:req.user
    })
})

webRoutes.get('/authTest2',isAuthenticated,authorizePermission('testPermission2'),async(req,res,next)=>{
    const roles=await req.user.getRoles();
    res.send({status:true,user:req.user,roles});
})


// cms
    // role
    webRoutes.get('/cms/role',RoleController.index);
    webRoutes.get('/cms/role/:roleId',RoleController.show);
    webRoutes.post('/cms/role/assignPermission',RoleController.assignPermission);
    webRoutes.post('/cms/role/revokePermission',RoleController.revokePermission);

module.exports=webRoutes;
const express=require('express');
const isAuthenticated = require('../services/authentication/middlewares/isAuthenticated');
const authController=require('../controllers/web/authController');
const pagesConfig = require('../config/pagesConfig');
const isGuest = require('../services/authentication/middlewares/isGuest');
const validateRequest = require('../validation/middlewares/validateRequest');
const authorizePermission = require('../services/authorization/middlewares/authorizePermission');

const RoleController=require('../controllers/web/RoleController');
const userController=require('../controllers/web/userController');
const authorizeSuperAdmin = require('../services/authorization/middlewares/authorizeSuperAdmin');
const verifyPassResetToken = require('../services/password-reset/middlewares/verifyPassResetToken');
const isVerified = require('../middlewares/isVerified');

const webRoutes=express.Router();

webRoutes.get('/',isAuthenticated,isVerified,(req,res,next)=>{
    res.render('auth/message',{
        pageTitle:'Test',
        message:'Suiiii'
    })
})

// login
webRoutes.get(pagesConfig.authentication.login.route,isGuest,validateRequest('login-page'),authController.getLogin);
webRoutes.get('/auth/quick-login',isGuest,authController.getQuickLogin);
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


// pass reset
webRoutes.get('/auth/password-reset/:guard/request',validateRequest('request-reset-page'),authController.getPasswordResetRequest);
webRoutes.post('/auth/password-reset/request',validateRequest('request-reset'),authController.postPasswordResetRequest);

webRoutes.get('/auth/password-reset/:token',validateRequest('reset-page'),verifyPassResetToken('url'),authController.getPasswordReset);
webRoutes.post('/auth/password-reset',validateRequest('reset'),verifyPassResetToken('body'),authController.postPasswordReset);

// cms
    // role
    webRoutes.get('/cms/role',isAuthenticated,authorizeSuperAdmin,RoleController.index);
    webRoutes.get('/cms/role/create',isAuthenticated,authorizeSuperAdmin,RoleController.create);
    webRoutes.post('/cms/role',isAuthenticated,authorizeSuperAdmin,validateRequest('create-role'),RoleController.store);
    webRoutes.get('/cms/role/:roleId',isAuthenticated,authorizeSuperAdmin,validateRequest('role-page'),RoleController.show);
    webRoutes.post('/cms/role/assignPermission',isAuthenticated,authorizeSuperAdmin,validateRequest('assign-role-permission'),RoleController.assignPermission);
    webRoutes.post('/cms/role/revokePermission',isAuthenticated,authorizeSuperAdmin,validateRequest('revoke-role-permission'),RoleController.revokePermission);
    webRoutes.delete('/cms/role/:roleId',isAuthenticated,authorizeSuperAdmin,validateRequest('delete-role'),RoleController.destroy);
    // user
    webRoutes.get('/cms/user/:guard/all',isAuthenticated,validateRequest('users-page'),userController.index);

    // vrify email
    webRoutes.get('/auth/verify-email/request',isAuthenticated,authController.verifyEmailRequest);
    webRoutes.get('/auth/verify-email/:token',authController.verifyEmail);
module.exports=webRoutes;
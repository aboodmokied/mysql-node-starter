const express=require('express');
const tryCatch = require('../util/tryCatch');
const apiRoutes=express.Router();
const authController=require('../controllers/api/authController');
const oAuthController=require('../controllers/oAuthController');
const verifyToken = require('../services/api-authentication/middlewares/verifyToken');
const validateRequest = require('../validation/middlewares/validateRequest');
const verifyEmailToken = require('../services/mail/middlewares/verifyEmailToken');
const verifyPassResetToken = require('../services/password-reset/middlewares/verifyPassResetToken');
const isVerified = require('../middlewares/isVerified');
const QueryFeatures = require('../util/QueryFeatures');
const Student = require('../models/Student');

apiRoutes.post('/login',validateRequest('login'),authController.login);
apiRoutes.post('/register',validateRequest('register'),authController.register);

// Oauth
apiRoutes.get('/auth/google/:process/:guard',validateRequest('oauth-request'),oAuthController.googleAuthRequest);
apiRoutes.get('/auth/google/callback',oAuthController.googleAuthResponse);


apiRoutes.get('/test',tryCatch(async(req,res,next)=>{
    const {data,respronseMetaDate}=await new QueryFeatures(req).findAllWithFeatures(Student);   
    console.log('asdasd',{data,respronseMetaDate}) 
    res.send({status:true,result:{data},...respronseMetaDate});
}))

// password reset
apiRoutes.post('/auth/password-reset/request',validateRequest('request-reset'),authController.postPasswordResetRequest);
apiRoutes.post('/auth/password-reset',validateRequest('reset'),verifyPassResetToken('body'),authController.postPasswordReset);

// email verification
apiRoutes.get('/auth/verify-email/request',verifyToken,authController.verifyEmailRequest);
apiRoutes.get('/auth/verify-email/:token',validateRequest('verify-email'),verifyEmailToken,authController.verifyEmail);


module.exports=apiRoutes;
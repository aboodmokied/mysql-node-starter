const express=require('express');
const tryCatch = require('../util/tryCatch');
const apiRoutes=express.Router();
const authController=require('../controllers/api/authController');
const verifyToken = require('../services/api-authentication/middlewares/verifyToken');
const validateRequest = require('../validation/middlewares/validateRequest');

apiRoutes.post('/login',validateRequest('login'),authController.login);
apiRoutes.post('/register',validateRequest('register'),authController.register);

apiRoutes.get('/test',verifyToken,tryCatch(async(req,res,next)=>{
    res.send({status:true,message:'successfull'});
}))


module.exports=apiRoutes;
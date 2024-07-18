const express=require('express');
const tryCatch = require('../util/tryCatch');
const apiRoutes=express.Router();
const authController=require('../controllers/api/authController');
const verifyToken = require('../services/api-authentication/middlewares/verifyToken');

apiRoutes.post('/login',authController.login);
apiRoutes.post('/register',authController.register);

apiRoutes.get('/test',verifyToken,tryCatch(async(req,res,next)=>{
    res.send({status:true,message:'successfull'});
}))


module.exports=apiRoutes;
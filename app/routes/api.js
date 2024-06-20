const express=require('express');
const tryCatch = require('../util/tryCatch');
const User = require('../models/User');
const apiRoutes=express.Router();



apiRoutes.get('/test',tryCatch(async(req,res,next)=>{
    res.send({status:true,message:'successfull'});
}))


module.exports=apiRoutes;
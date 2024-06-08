const express=require('express');
const Application = require('../Application');
const tryCatch = require('../util/tryCatch');
const NotFoundError = require('../Errors/ErrorTypes/NotFoundError');
const apiRoutes=express.Router();



apiRoutes.get('/test',tryCatch(async(req,res,next)=>{
    throw new NotFoundError();
}))


module.exports=apiRoutes;
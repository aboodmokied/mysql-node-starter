const express=require('express');
const apiRoutes=express.Router();

apiRoutes.get('test',(req,res,next)=>{
    res.send({message:'Done'});
})


module.exports=apiRoutes;
const express=require('express');
require('dotenv').config();
const app=express();


// Routes
// ... 

app.get('/',(req,res,next)=>{
    console.log('test test');
    res.send({message:'Done'});
})

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server Running on PORT: ${PORT}`);
})
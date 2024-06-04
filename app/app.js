const express=require('express');
require('dotenv').config();
const app=express();


// Routes
// ... 

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server Running on PORT: ${PORT}`);
})
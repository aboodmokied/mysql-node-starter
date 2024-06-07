const express=require('express');
require('dotenv').config();
const Application = require('./Application');
const app=express();

const application=new Application();

application.run(app).then(()=>{
    const PORT=process.env.PORT || 5000;
    app.listen(PORT,()=>{
        console.log(`Server Running on PORT: ${PORT}`);
    })
}).catch(err=>{
    console.log('Server Error',err);
})

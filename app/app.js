const express=require('express');
require('dotenv').config();
const Application = require('./Application');
const { errorLogger, logger } = require('./logging/Logger');
const app=express();

const application=new Application();

application.run(app).then(()=>{
    const PORT=process.env.PORT || 3000;
    const userSeeder = require('./database/seeders/userSeeder');
    userSeeder({email:'abood2@admin.com',name:'admin_abood',password:'Abood123456*',guard:'admin'});
    app.listen(PORT,()=>{
        logger.info(`Server is running on port ${PORT}`);
    })
}).catch(error=>{
    errorLogger.error(`ServerRunningError: 500 - ${error.stack}`);
})

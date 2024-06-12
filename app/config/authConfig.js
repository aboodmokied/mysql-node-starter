const User = require("../models/User");

module.exports={
    defaults:{
        defaultGuard:'student'
    },
    guards:{
        student:{
            drivers:['session','token'],
            provider:'students',
        }
    },
    providers:{
        students:{
            driver:'Sequelize',
            mainModel:User, // mainModel: contain all users types
            subModel:'StudentDetails' //  subModel: contain extra info about specific type of users
        }
    },
   
}
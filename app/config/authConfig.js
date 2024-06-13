
module.exports={
    defaults:{
        defaultGuard:'student'
    },
    guards:{
        student:{
            drivers:['session','token'],
            mainProvider:'main', // mainProvider: contain all users types
            subProvider:'studentDetails' //  subProvider: contain extra info about specific type of users
        }
    },
    providers:{
        main:{
            driver:'Sequelize',
            model:require("../models/User"), 
        },
        studentDetails:{
            driver:'Sequelize',
            model:'StudentDetails' 
        }
    },
   
}
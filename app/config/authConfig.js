
module.exports={
    defaults:{
        defaultGuard:'student'
    },
    guards:{
        student:{
            code:100,
            drivers:['session','token'],
            registeration:'global', // (that means any user can create a student account) or admin: (only admin can create new accounts) 
            mainProvider:'main', // mainProvider: contain all users types
            subProvider:'studentDetails', //  subProvider: contain extra info about specific type of users
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
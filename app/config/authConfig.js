
module.exports={
    defaults:{
        defaultGuard:'student'
    },
    guards:{
        admin:{
            code:200, // unique number
            drivers:['session'],
            registeration:'by-admin', // (that means any user can create a student account) or admin: (only admin can create new accounts) 
            mainProvider:'main', // mainProvider: contain all users types
            subProvider:'adminDetails', //  subProvider: contain extra info about specific type of users
        },
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
        adminDetails:{
            driver:'Sequelize',
            model:'AdminDetails' 
        },
        studentDetails:{
            driver:'Sequelize',
            model:'StudentDetails' 
        }
    },
   
}
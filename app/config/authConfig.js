
module.exports={
    defaults:{
        defaultGuard:'student',
    },
    permissions:{
        testPermission:{
            name:'test',
        }
    },
    commonRole:{ // role shared between all users
        name:'user'
    }, 
    guards:{ // user types
        admin:{
            drivers:['session','token'],
            registeration:'by-admin', // (that means any user can create a student account) or admin: (only admin can create new accounts) 
            mainProvider:'main', // mainProvider: contain all users types
            subProvider:'adminDetails', //  subProvider: contain extra info about specific type of users
            role:{
                name:'admin',
            }
        },
        student:{
            drivers:['session','token'],
            registeration:'global', // (that means any user can create a student account) or admin: (only admin can create new accounts) 
            mainProvider:'main', // mainProvider: contain all users types
            subProvider:'studentDetails', //  subProvider: contain extra info about specific type of users
            role:{
                name:'student',
            }
        
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
    }
    
   
}
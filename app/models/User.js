const { DataTypes } = require("sequelize");
const Application = require("../Application");

const User=Application.connection.define('user',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{  
        type:DataTypes.STRING,
        allowNull:false
    },
    guard:{  // means user type e.g:student
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports=User;

const { DataTypes } = require("sequelize");
const Application = require("../Application");

const Admin=Application.connection.define('admin',{
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    name:{
        type:DataTypes.STRING(30),
        allowNull:false,
    },
    password:{  
        type:DataTypes.STRING,
        allowNull:false
    },
    guard:{
        type:DataTypes.STRING,
        defaultValue:'admin'
    }
})

module.exports=Admin;

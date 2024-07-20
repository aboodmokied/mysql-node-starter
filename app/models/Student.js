const { DataTypes } = require("sequelize");
const Application = require("../Application");

const Student=Application.connection.define('student',{
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
        defaultValue:'student'
    }
})

module.exports=Student;

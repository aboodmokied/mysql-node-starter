const { DataTypes } = require("sequelize");
const Application = require("../Application");

const Permission=Application.connection.define('permission',{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
});

module.exports=Permission;
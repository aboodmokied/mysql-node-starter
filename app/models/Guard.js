const { DataTypes } = require("sequelize");
const Application = require("../Application");

const Guard=Application.connection.define('guard',{
    id:{
        type:DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    }
})

module.exports=Guard;
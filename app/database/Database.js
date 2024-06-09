const {Sequelize}=require('sequelize');
const mysql=require('mysql2');
const database = require('../config/database');

class Database{
    #connection=null;
    #connectionSetting=null;
    #db=null;
    constructor(db=database.default){
        this.#db=db;
        return this;
    }


    connect(){
        this.#connectionSetting=database.connections[this.#db];
        this.#connection=new Sequelize(this.#connectionSetting);
        return this.#connection;
    }

    async #createDB(){
        if(this.#db=='mysql'){
            const {username:user,password,host,port,database:databaseName}=database.connections['mysql'];
            let connection=mysql.createPool({
            user,
            password,
            host,
            port
        }).promise();
            try {
                await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`)
                await this.migrate();
                connection.end();
                connection=null;
            } catch (error) {
                throw error;
            }
        }
    }

    async migrate(){
        try {
            await this.#connection.sync();
        } catch (error) {
            if(error.original.errno==1049){ // database not found
                await this.#createDB();
            }else{
                throw error;
            }
        }
    }

}

module.exports=Database;
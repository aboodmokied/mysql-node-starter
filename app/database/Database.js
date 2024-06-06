const {Sequelize}=require('sequelize');
const mysql=require('mysql2');
const database = require('../config/database');

class Database{
    #connection=null;
    #connectionSetting=null;
    #db=null;
    constructor(db=database.default){
        // singleton
        if(!Database.instance){
            this.#db=db;
            return Database.instance??=this;
        }
        return Database.instance;
    }


    connect(){
        this.#connectionSetting=database.connections[this.#db];
        this.#connection=new Sequelize(this.#connectionSetting);
        return this.#connection;
    }

    #createDB(){
        if(this.#db=='mysql'){
            const {username:user,password,host,port,database}=database.connections['mysql'];
            let connection=mysql.createPool({
            user,
            password,
            host,
            port
        })
            connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`,(error,result)=>{
            if(!error){
                migrate();
                connection.end();
                connection=null;
            }else{
                console.log('Database Error',error);
            }
        })
        }
    }

    async migrate(){
        try {
            await this.#connection.sync();
        } catch (error) {
            if(error.original.errno==1049){ // database not found
                this.#createDB();
            }else{
                console.log('Database Error',error);
            }
        }
    }

}

module.exports=Database;
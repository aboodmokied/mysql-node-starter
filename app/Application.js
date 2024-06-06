const Kernal = require("./Kernal");
const Database = require("./database/Database");
const express=require('express');
const webRoutes = require("./routes/web");
const apiRoutes = require("./routes/api");

class Application{
    #app=null;
    #database=null;
    #connection=null;
    constructor(){
        // singleton
        return Database.instance??=this;
    }

    get app(){
        return this.#app;
    }

    // set app(app){
    //     this.#app=app;
    //     this.#setup()
    // }
    
    
    get connection(){
        return this.#connection;
    }

    async run(app){
        this.#app=app;
        await this.#setup()
    }

    async #setup(){
        this.#database=new Database();
        this.#connection=this.#database.connect();
        this.#defineSettings()
        this.#defineMiddlewares()
        this.#defineRoutes();
        await this.#connection.migrate();
    }


    #defineSettings(){
        this.#app.use(express.static('public'));
    }
    #defineMiddlewares(){
        this.#app.use(Kernal.global);
    }
    #defineRoutes(){
        this.#app.use(Kernal.web,webRoutes)
        this.#app.use('/api',Kernal.api,apiRoutes);
        // set global error handler
    }




}

module.exports=Application;
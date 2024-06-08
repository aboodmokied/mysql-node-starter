const Kernal = require("./Kernal");
const Database = require("./database/Database");
const express=require('express');


class Application{
    #app=null;
    #database=null;
    #connection=null;
    constructor(){
        // singleton
        return Application.instance??=this;
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
        // the ordering is important
        this.#defineSettings()
        this.#defineMiddlewares()
        this.#defineRoutes();
        await this.#database.migrate();
    }


    #defineSettings(){
        this.#app.use(express.static('public'));
    }
    #defineMiddlewares(){
        this.#app.use(Kernal.global);
    }
    #defineRoutes(){
        this.#app.use(Kernal.web,require("./routes/web"))
        this.#app.use('/api',Kernal.api,require("./routes/api"));
        // global error handler
        this.#app.use(Kernal.error);
    }

}

module.exports=Application;
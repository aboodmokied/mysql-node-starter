const Kernal = require("./Kernal");
const Database = require("./database/Database");
const express=require('express');


class Application{
    #app=null;
    #database=null;
    static connection=null;
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
    
    
    // get connection(){
    //     return Application.connection;
    // }

    async run(app){
        this.#app=app;
        await this.#setup()
    }

    async #setup(){
        this.#database=new Database();
        Application.connection=this.#database.connect();
        // the ordering is important
        this.#defineSecrityMiddlewares();
        this.#defineSettings();
        this.#defineMiddlewares();
        this.#defineModels();
        this.#defineRoutes();
        await this.#database.migrate();
    }


    #defineSettings(){
        this.#app.use(express.static('public'));
    }
    #defineSecrityMiddlewares(){
        this.#app.use(Kernal.security);
    }
    #defineMiddlewares(){
        this.#app.use(Kernal.global);
    }

    #defineModels(){
        require('./models'); // this will run the index.js file so it will load all defined models (Dynamic Model Loader)
        require('./models/relations'); // define relations between models
    }   
    
    #defineRoutes(){
        this.#app.use(Kernal.web,require("./routes/web"))
        this.#app.use('/api',Kernal.api,require("./routes/api"));
        // global error handler
        this.#app.use(Kernal.error);
    }

}

module.exports=Application;
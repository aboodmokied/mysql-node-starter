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
        this.#defineModels();
        this.#defineSecrityMiddlewares();
        this.#defineSettings();
        this.#defineMiddlewares();
        this.#defineRoutes();
        await this.#database.migrate();
        // await this.#defineAuthentication();
    }


    #defineSettings(){
        const rootPath=require.main.path;
        const path=require('path');

        this.#app.set('view engine', 'ejs');
        this.#app.set('views', path.join(rootPath, 'views'));

        this.#app.use(express.static(path.join(rootPath, 'public')));
        this.#app.use(express.static(path.join(rootPath, 'node_modules', 'admin-lte')));
    }
    #defineSecrityMiddlewares(){
        const Kernal = require("./Kernal");
        this.#app.use(Kernal.security);
    }
    #defineMiddlewares(){
        const Kernal = require("./Kernal");
        this.#app.use(Kernal.global);
    }

    // async #defineAuthentication(){
    //     const Authenticate = require("./services/authentication/Authenticate");
    //     await new Authenticate().setup(); // create guards that exists in authConfig
    // }

    #defineModels(){
        require('./models'); // this will run the index.js file so it will load all defined models (Dynamic Model Loader)
        require('./models/relations'); // define relations between models
    }   
    
    #defineRoutes(){
        const Kernal = require("./Kernal");
        this.#app.use(Kernal.web,require("./routes/web"))
        this.#app.use('/api',Kernal.api,require("./routes/api"));
        // global error handler
        this.#app.use(Kernal.error);
    }

}

module.exports=Application;
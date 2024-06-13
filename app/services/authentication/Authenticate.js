const { where } = require("sequelize");
const authConfig = require("../../config/authConfig");
const bcrypt=require('bcryptjs');

class Authenticate{
    #guard=authConfig.defaults.defaultGuard;
    constructor(){
        return Authenticate.instance??=this;
    }

    withGuard(guard){
        if(guard){
            this.#guard=guard;
        }
        return this;
    }

    async attemp(req){
        // Before: guard validation required
        const guardObj=authConfig.guards[this.#guard];
        if(!guardObj) throw Error('something went wrong in authConfig, check it'); // error for the devs
        if(guardObj.drivers.indexOf('session')!==-1){
            const {mainProvider}=guardObj;
            const providerObj=authConfig.providers[mainProvider];
            const {driver}=providerObj;
            if(driver=='Sequelize'){ // use Sequelize 
                const {model}=providerObj;
                // verify the user
                const {password:reqPassword}=req.body;
                delete req.body.password;
                const user=await model.findOne({where:{...req.body}});
                if(!user) return {passed:false,error:'wrong credentials'};
                if(this.#guard !=user.guard) return {passed:false,error:`${user.guard} can't login as ${this.#guard}`}; 
                if(!bcrypt.compareSync(reqPassword,user.password)) return {passed:false,error:'wrong password'};
                // passed
                req.session.isAuthenticated=true;
                req.session.userId=user.id;
                return {passed:true,error:null};
            }else if(driver=='db'){ // use pure mysql 
                throw Error('this feature not completed');
            }else{
                throw Error('something went wrong in authConfig, check it'); // error for the devs
            }
        }else{
            return {passed:false,error:'proccess not allowed'}; // session-based authentication not allowed for this type of users
        }
    }

    logout(){
        req.session.destroy(error=>{
            if(error){
                throw Error('Failed to destroy session');
            }
        })
    }
}

module.exports=Authenticate;
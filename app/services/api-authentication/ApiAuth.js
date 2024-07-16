const { where } = require("sequelize");
const authConfig = require("../../config/authConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const AuthClient = require("../../models/AuthClient");
const crypto=require('crypto');
const jwt=require('jsonwebtoken');
const AccessToken = require("../../models/AccessToken");

class ApiAuth{
    constructor(){
        return ApiAuth.instance??=this;
    }

    async setup(){
        await this.#defineClients();
    }

    applyApiAuth(model){
        model.prototype.generateToken=async function(revokePrev=false){
            const guardObj=authConfig.guards[this.guard];
            if(!guardObj.drivers.includes('token')){
                throw new BadRequestError('Proccess Not Allowed');
            }
            const authClient=await AuthClient.findOne({where:{guard:this.guard}});
            const token=jwt.sign({id:this.id},authClient.secret); // fffff.sssss.ttttt
            const signature=token.split('.')[2];
            const expiresAt=Date.now() + 30*24*60*60*1000;

            if(revokePrev){
                await AccessToken.update({revoked:true},{where:{userId:this.id,clientId:authClient.id}});
            }
            await AccessToken.create({
                userId:this.id,
                clientId:authClient.id,
                signature,
                expiresAt
            });
            return token;
        };
        model.prototype.apiLogout=async function(){
            const updatedToken=await this.token.update({revoked:true});
            return updatedToken != (null || undefined);
        }
    }

    async #defineClients(){
        for(let guardName in authConfig.guards){
            const guardObj=authConfig.guards[guardName];
            if(guardObj.drivers.includes('token')){
                const count=await AuthClient.count({where:{guard:guardName}});
                if(!count){
                    const secret=this.#generateSecret();
                    await AuthClient.create({guard:guardName,secret});
                }
            }
        }
    }

    #generateSecret(){
        const secret=crypto.randomBytes(32).toString('hex');
        return crypto.createHash('sha256').update(secret).digest('hex');
    }
}

module.exports=ApiAuth;
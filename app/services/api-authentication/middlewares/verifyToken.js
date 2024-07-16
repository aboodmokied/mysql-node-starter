const tryCatch = require("../../../util/tryCatch");
const AuthClient=require('../../../models/AuthClient');
const jwt=require('jsonwebtoken');
const User = require("../../../models/User");
const AuthenticationError = require("../../../Errors/ErrorTypes/AuthenticationError");

const verifyToken=tryCatch(async(req,res,next)=>{
    const requestToken=req.headers.authorization;
    if(requestToken.startsWith('Bearer')){
        const token=requestToken.split(' ')[1];
        const signature=token.split('.')[2];
        const accessToken=await accessToken.findOne({where:{signature,revoked:false}});
        if(accessToken){
            if(accessToken.expiresAt>=Date.now()){
                const authClient=await AuthClient.findOne({where:{id:accessToken.clientId,revoked:false}});
                if(authClient){
                    let payload=null;
                    try {
                        payload=jwt.verify(token,authClient.secret); // throws an error
                    } catch (error) {
                        throw new AuthenticationError('Unathorized, Invalid Token');
                    }
                    if(payload?.id==accessToken.userId){
                        const user=await User.findByPk(accessToken.userId);
                        if(user){
                            req.user=user;
                            return next();
                        }
                    }
                    
                }
            }
            
        }
    }
    throw new AuthenticationError();
});

module.exports=verifyToken;
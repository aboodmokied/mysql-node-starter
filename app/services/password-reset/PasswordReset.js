const authConfig = require("../../config/authConfig");
const { passReset } = require("../../config/securityConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const PasswordResetToken = require("../../models/PasswordResetToken");

class PasswordReset{
    #email=null;
    #guard=authConfig.defaults.defaultGuard;

    constructor(){
        return PasswordReset.instance??=this;
    }
    
    withGuard(guard){
        if(guard){
            this.#guard=guard;
        }
        return this;
    }

    withEmail(email){
        if(!email){
            throw new BadRequestError('Email Required For Password Reset');
        }
        this.#email=email;
        return this;
    }

    async request(){
        const token=this.#generateToken();
        const expiresAt=Date.now() + passReset.expiresAfter * 60 * 1000;
        await PasswordResetToken.update({revoked:true},{where:{email:this.#email,guard:this.#guard}});
        const passResetToken=await PasswordResetToken.create({
            email:this.#email,
            token,
            expiresAt,
            guard:this.#guard
        });
        const url=this.#generateUrl(token);
        console.log(url);
        return true;
    }

    #generateUrl(token){
        return `${process.env.APP_URL}:${process.env.PORT}/password-reset/reset/${token}?email=${email}`;
    }
    #generateToken(){
        const token=crypto.randomBytes(32).toString('hex');
        return crypto.createHash('sha256').update(token).digest('hex');
    }

}

module.exports=PasswordReset;
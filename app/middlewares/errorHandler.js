const AppError = require("../Errors/AppError");
const {Server} = require("../config/ErrorConfig");

module.exports=(error,req,res,next)=>{
    // custom error
    if(error instanceof AppError){  
        const {type,message}=error;
        if(error.type==="Validation"){
            const {errors}=error;
            return res.status(error.statusCode).send({status:false,error:{type,message,errors}});
        }
        return res.status(error.statusCode).send({status:false,error:{type,message}});
    }
    // server error
    console.log("Server Error",error); 
    res.status(Server.statusCode).send({status:false,error:{type:Server.type,message:Server.message}});
}

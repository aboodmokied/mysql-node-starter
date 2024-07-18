const NotFoundError = require("../Errors/ErrorTypes/NotFoundError");

const notFoundHandler=(req,res,next)=>{
    throw new NotFoundError();
};

module.exports=notFoundHandler;
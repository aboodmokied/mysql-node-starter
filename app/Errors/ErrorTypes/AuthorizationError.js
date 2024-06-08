const {Authorization} = require("../../config/ErrorConfig");
const AppError = require("../AppError");

class AuthorizationError extends AppError{
    constructor(errors,message=Authorization.message,statusCode=Authorization.statusCode){
        super(message);
        this.type=Authorization.type;
        this.statusCode=statusCode;
    }
}

module.exports=AuthorizationError;
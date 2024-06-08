const {Authentication} = require("../../config/ErrorConfig");
const AppError = require("../AppError");

class AuthenticationError extends AppError{
    constructor(message=Authentication.message,statusCode=Authentication.statusCode){
        super(message);
        this.type=Authentication.type;
        this.statusCode=statusCode;
    }
}

module.exports=AuthenticationError;
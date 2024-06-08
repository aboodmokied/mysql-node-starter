const {NotFound} = require("../../config/ErrorConfig");
const AppError = require("../AppError");

class NotFoundError extends AppError{
    constructor(message=NotFound.message,statusCode=NotFound.statusCode){
        super(message);
        this.type=NotFound.type;
        this.statusCode=statusCode;
    }
}

module.exports=NotFoundError;
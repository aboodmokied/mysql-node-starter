module.exports={
    NotFound:{
        type:"NotFound",
        message:'Not Found',
        statusCode:404
    },
    Authentication:{
        type:"Authentication",
        message:'Unauthorized',
        statusCode:401
    },
    Authorization:{
        type:"Authorization",
        message:'Forbidden',
        statusCode:403
    },
    Validation:{
        type:"Validation",
        message:'Invalid Input',
        statusCode:400
    },
    RateLimit:{
        type:"RateLimit",
        message:'Too many requests from this IP, please try again later',
        statusCode:429
    },
    Server:{
        type:"Server",
        message:'Something went wrong',
        statusCode:500
    }
}
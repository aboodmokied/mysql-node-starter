const {validationResult}=require('express-validator');
const ValidationError=require('../../Errors/ErrorTypes/ValidationError');
const { loginValidation, loginPageValidation, registerPageValidation, registerValidation } = require('../schemas/authValidation');
const { createRoleValidation } = require('../schemas/authorizationValidation');

// handles validations result
const checkResult=(req,res,next)=>{
    const errors=validationResult(req);
    if(errors.isEmpty()){
        return next();
    }

    throw new ValidationError(errors.array({onlyFirstError:true})); // into global handler
}

const validateRequest=(type)=>{
    let validations=[];
    switch(type) {
        case 'login-page':
            validations=loginPageValidation;
            break;
        case 'login':
            validations=loginValidation;
            break;
        case 'register-page':
            validations=registerPageValidation;
            break;
        case 'register':
            validations=registerValidation;
            break;
        case 'create-role':
            validations=createRoleValidation;
            break;
        default:
          throw Error('type required');
      }
    
    return [...validations,checkResult];
}



module.exports=validateRequest;
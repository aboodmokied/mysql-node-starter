const {validationResult}=require('express-validator');
const ValidationError=require('../../Errors/ErrorTypes/ValidationError');
const { loginValidation, loginPageValidation, registerPageValidation, registerValidation } = require('../schemas/authValidation');
const { createRoleValidation, assignRolePermissionValidation, revokeRolePermissionValidation, deleteRoleValidation, rolePageValidation } = require('../schemas/authorizationValidation');
const { usersPageValidation } = require('../schemas/userValidation');

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
        case 'users-page':
            validations=usersPageValidation;
            break;
        case 'role-page':
            validations=rolePageValidation;
            break;
        case 'delete-role':
            validations=deleteRoleValidation;
            break;
        case 'assign-role-permission':
            validations=assignRolePermissionValidation;
            break;
        case 'revoke-role-permission':
            validations=revokeRolePermissionValidation;
            break;
        default:
          throw Error('type required');
      }
    
    return [...validations,checkResult];
}



module.exports=validateRequest;
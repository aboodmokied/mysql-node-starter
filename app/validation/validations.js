const { body } = require("express-validator");
const User = require("../models/User");
const authConfig = require("../config/authConfig");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

exports.validateEmail=body('email').normalizeEmail().notEmpty().withMessage('Email Required').isEmail().withMessage('Invalid Email')
exports.validateEmailExistence=body('email').normalizeEmail().custom(async(input,{req})=>{
    const guardObj=authConfig.guards[req.body.guard];
    if(!guardObj){
        return Promise.reject('AuthConfig Error');
    }
        const model=authConfig.providers[guardObj.provider]?.model;
        const count=await model.count({where:{email:input}});
        if(count){
            return Promise.reject('Email already in use');
        }
})

exports.validateName=body('name').notEmpty().withMessage('Username Required').isLength({max:30,min:3}).withMessage('Username length should be between 3 to 30')

exports.validateRegisterPassword=body('password')
.isLength({ min: 8 })
.withMessage('Password must be at least 8 characters long')
.matches(/[A-Z]/)
.withMessage('Password must contain at least one uppercase letter')
.matches(/[a-z]/)
.withMessage('Password must contain at least one lowercase letter')
.matches(/[0-9]/)
.withMessage('Password must contain at least one number')
.matches(/[\W_]/)
.withMessage('Password must contain at least one special character');


exports.validateLoginPassword=body('password')
.notEmpty().withMessage('Password Required');

exports.validateConfirmPassword=body('confirmPassword').custom((input,{req})=>{
    if(input===req.body.password){
        return true;
    }
    throw new Error('Password and Confirm Password are not compatable')
});


exports.validateGuard=(existsIn='body',validateGlobalRegistration=false)=>{
    const holder=require('express-validator')[existsIn];
    return holder('guard').notEmpty().withMessage('Guard Required').custom((input)=>{
        if(input in authConfig.guards){
            if(!validateGlobalRegistration){
                return true;
            }
            const guardObj=authConfig.guards[input];
            if(guardObj.registeration=='global'){
                return true;
            }
        }
        throw new Error('Invalid Guard');
    })
}

exports.validateRoleName=body('name').notEmpty().withMessage('Role Name Required').custom(async(name)=>{
    const count=await Role.count({where:{name}});
    if(count){
        return Promise.reject('Role Exists')
    }
})

exports.validateRoleExistance=(existsIn='body')=>{
    const holder=require('express-validator')[existsIn];
    return holder('roleId').notEmpty().withMessage('Role id required').custom(async(roleId)=>{
        const count=await Role.count({where:{id:roleId}});
        if(!count){
            return Promise.reject('Role not found');
        }
    })
}
exports.validatePermissionExistance=body('permissionId').notEmpty().withMessage('Permission id required').custom(async(permissionId)=>{
    const count=await Permission.count({where:{id:permissionId}});
    if(!count){
        return Promise.reject('Permission not found');
    }
})

// exports.validateUserExistance=body('userId').notEmpty().withMessage('User id required').custom(async(userId)=>{
//     const count=await User.count({where:{id:userId}});
//     if(!count){
//         return Promise.reject('User not found');
//     }
// })
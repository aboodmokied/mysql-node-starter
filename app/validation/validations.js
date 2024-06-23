const { body } = require("express-validator");
const User = require("../models/User");
const authConfig = require("../config/authConfig");

exports.validateEmail=body('email').normalizeEmail().notEmpty().withMessage('Email Required').isEmail().withMessage('Invalid Email')
exports.validateEmailExistence=body('email').normalizeEmail().custom(async(input)=>{
    const count=await User.count({where:{email:input}});
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
    console.log(input,req.body.password);
    if(input===req.body.password){
        return true;
    }
    throw new Error('Password and Confirm Password are not compatable')
});


exports.validateGuard=(existsIn='body')=>{
    const holder=require('express-validator')[existsIn];
    return holder('guard').notEmpty().withMessage('Guard Required').custom((input)=>{
        if(input in authConfig.guards){
            return true;
        }
        return false;
    })
}
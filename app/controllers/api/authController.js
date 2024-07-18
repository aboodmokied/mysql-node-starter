const authConfig = require("../../config/authConfig");
const AuthenticationError = require("../../Errors/ErrorTypes/AuthenticationError");
const User = require("../../models/User");
const ApiAuth = require("../../services/api-authentication/ApiAuth");
const Register = require("../../services/registration/Register");
const tryCatch = require("../../util/tryCatch");


exports.register=tryCatch(async(req,res,next)=>{
    // Before: guard and user data validation required, check if user exist.
    const {guard}=req.body;
    const user=await new Register().withGuard(guard).create(req);
    res.status(201).send({status:true,result:{user}});
});

exports.login=tryCatch(async(req,res,next)=>{
    const {guard}=req.body;
    const token=await new ApiAuth().withGuard(guard).generateToken(req);
    res.send({status:true,result:{token}})
})
const ApiAuth = require("../../services/api-authentication/ApiAuth");
const PasswordReset = require("../../services/password-reset/PasswordReset");
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


// pass reset
exports.postPasswordResetRequest=tryCatch(async(req,res,next)=>{
    const {email,guard}=req.body;
    const passReset=new PasswordReset();
    const wasSent=await passReset.withEmail(email).withGuard(guard).request();
    res.send({status:true,result:{
        message:'Mail was sent, check your email box'
    }})
});

exports.postPasswordReset=tryCatch(async(req,res,next)=>{
    // BEFORE: verifyPasswordResetToken Middleware
    const updatedUser=await new PasswordReset().update(req);
    res.send({status:true,result:{
        message:'Password Updated Succefully',
        user:updatedUser
    }})
});

// verify email
exports.verifyEmailRequest=tryCatch(async(req,res,next)=>{
    const message=await req.user.verifyEmail();
    res.send({status:true,result:{
        message
    }})
});

exports.verifyEmail=(req,res,next)=>{
    res.send({status:true,result:{
        message:'Email verified',
        user:req.targetUser
    }});   
};

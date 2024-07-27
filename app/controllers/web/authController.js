const authConfig = require("../../config/authConfig");
const pagesConfig = require("../../config/pagesConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const VerifyEmailToken = require("../../models/verifyEmailToken");
const Authenticate = require("../../services/authentication/Authenticate");
const PasswordReset = require("../../services/password-reset/PasswordReset");
const Register = require("../../services/registration/Register");
const tryCatch = require("../../util/tryCatch");


exports.getLogin=(req,res,next)=>{
    // Before: guard and user data validation required.
    const guards=Object.keys(authConfig.guards).filter(guard=>authConfig.guards[guard].drivers.includes('session'));
    const {guard}=req.params;
    req.session.pagePath=req.path;
    res.render(pagesConfig.authentication.login.page,{
        pageTitle:`${guard[0].toUpperCase()}${guard.slice(1)} Login`,
        guards,
        currentGuard:guard
    })
}
exports.postLogin=tryCatch(async(req,res,next)=>{
    const {guard}=req.body;
    const {passed,error}=await new Authenticate().withGuard(guard).attemp(req);
    if(passed)return res.redirect('/');
    res.with('old',req.body).with('errors',[{msg:error}]).redirect(pagesConfig.authentication.login.path(guard))
});



exports.logout=(req,res,next)=>{
    const {guard}=req.user;
    new Authenticate().logout(req);
    req.user=undefined;
    res.redirect(pagesConfig.authentication.login.path(guard));
};


exports.getRegister=(req,res,next)=>{
    // Before: guard and user data validation required.
    const {guard}=req.params;
    const guards=Object.keys(authConfig.guards).filter(guard=>authConfig.guards[guard].registeration=='global')
    req.session.pagePath=req.path;
    res.render(pagesConfig.authentication.register.page,{
        pageTitle:`${guard[0].toUpperCase()}${guard.slice(1)} Register`,
        currentGuard:guard,
        guards
    })
}

exports.postRegister=tryCatch(async(req,res,next)=>{
    // Before: guard and user data validation required, check if user exist.
    const {guard}=req.body;
    const user=await new Register().withGuard(guard).create(req);
    res.with('old',{email:req.body.email}).redirect(pagesConfig.authentication.login.path(guard))
});



// password reset
/**
 * GET => /auth/password-reset/guard
 * POST => /auth/password-reset/request   => sent email
 * GET => /auth/password-reset/token?email
 * POST => /auth/password-reset
 * */  

exports.getPasswordResetRequest=(req,res,next)=>{
    const {guard}=req.params;
    req.session.pagePath=req.path;
    res.render('auth/request-reset',{
        pageTitle:'Request Password Reset',
        guard
    })
};
exports.postPasswordResetRequest=tryCatch(async(req,res,next)=>{
    const {email,guard}=req.body;
    const passReset=new PasswordReset();
    const wasSent=await passReset.withEmail(email).withGuard(guard).request();
    res.with('message','Mail was sent, check your email box').redirect(`/auth/password-reset/${guard}/request`)
})

exports.getPasswordReset=(req,res,next)=>{
    const {token}=req.params;
    const {email}=req.query;
    const queryParams = req.query;
    const fullPathWithQueryParams = `${req.path}?${new URLSearchParams(queryParams).toString()}`;
    req.session.pagePath=fullPathWithQueryParams;
    res.render('auth/reset',{
        pageTitle:'Reset Password',
        email,
        token
    });
}


exports.postPasswordReset=tryCatch(async(req,res,next)=>{
    const updatedUser=await new PasswordReset().update(req);
    res.redirect(`/auth/login/${updatedUser.guard}`);
})




// verify account

exports.verifyEmailRequest=tryCatch(async(req,res,next)=>{
    const {wasSent,message}=await req.user.verifyEmail();
    res.render('auth/message',{
        pageTitle:'Message',
        message
    })
});

exports.verifyEmail=tryCatch(async(req,res,next)=>{
    const {token}=req.params;
    const {email}=req.query;
    const verifyEmailToken=await VerifyEmailToken.findOne({where:{token,revoked:false}});
    if(verifyEmailToken){
        if(verifyEmailToken.email==email){
            const {guard}=verifyEmailToken;
            const guardObj=authConfig.guards[guard];
            const model=authConfig.providers[guardObj.provider]?.model;
            if(model){
                await model.update({verified:true},{where:{email,guard}});
                res.redirect('/');
            }
        }
    }
    throw new BadRequestError('Invalid Token');
});





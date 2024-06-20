const authConfig = require("../config/authConfig");
const pagesConfig = require("../config/pagesConfig");
const Authenticate = require("../services/authentication/Authenticate");
const tryCatch = require("../util/tryCatch");


exports.getLogin=(req,res,next)=>{
    // Before: guard and user data validation required.
    const guards=Object.keys(authConfig.guards).filter(guard=>authConfig.guards[guard].drivers.includes('session'));
    const {guard}=req.params;
    res.render(pagesConfig.authentication.login.page,{
        pageTitle:`${guard[0].toUpperCase()}${guard.slice(1)} Login`,
        guards,
        currentGuard:guard
    })
}
exports.postLogin=tryCatch(async(req,res,next)=>{
    // Before: guard and user data validation required.
    const {guard}=req.body;
    const {passed,error}=await new Authenticate().withGuard(guard).attemp(req);
    if(passed)return res.send({status:true,message:'Authenticated'});
    res.status(401).send({status:false,error:{message:error}});
});



exports.logout=(req,res,next)=>{
    const {guard}=req.user;
    new Authenticate().logout();
    req.user=undefined;
    res.redirect(pagesConfig.authentication.login.path(guard.name));
};


exports.getRegister=(req,res,next)=>{
    // Before: guard and user data validation required.
    const {guard}=req.params;
    const guards=Object.keys(authConfig.guards).filter(guard=>authConfig.guards[guard].registeration=='global')
    res.render(pagesConfig.authentication.register.page,{
        pageTitle:`${guard[0].toUpperCase()}${guard.slice(1)} Register`,
        currentGuard:guard,
        guards
    })
}

exports.postRegister=tryCatch(async(req,res,next)=>{
    // Before: guard and user data validation required, check if user exist.
    const {guard}=req.body;
    const result=await new Authenticate().withGuard(guard).register(req);
    if(result.created)return res.status(201).send({status:true,result:result.result});
    res.status(400).send({status:false,error:{message:result.error}});
});

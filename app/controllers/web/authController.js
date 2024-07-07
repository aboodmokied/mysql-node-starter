const authConfig = require("../../config/authConfig");
const pagesConfig = require("../../config/pagesConfig");
const Authenticate = require("../../services/authentication/Authenticate");
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
    if(passed)return res.send({status:true,message:'Authenticated'});
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
    const result=await new Authenticate().withGuard(guard).register(req);
    // if(result.created)return res.status(201).send({status:true,result:result.result});
    if(result.created)return res.with('old',{email:req.body.email}).redirect(pagesConfig.authentication.login.path(guard))
    res.status(400).send({status:false,error:{message:result.error}});
});

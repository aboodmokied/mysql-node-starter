const User = require("../../../models/User");
module.exports=async(req,res,next)=>{
    if(req.session?.isAuthenticated&&req.session?.userId){
        const user=await User.findByPk(req.session.userId);
        if(user){
            req.user=user;
        }else{ // user was deleted from db or something like that
            req.session.isAuthenticated=false;
            req.session.userId=undefined;
        }
    }
    next();
}
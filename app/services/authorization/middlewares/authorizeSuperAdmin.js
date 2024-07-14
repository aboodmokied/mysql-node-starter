const AuthorizationError = require("../../../Errors/ErrorTypes/AuthorizationError");
const SuperAdmin = require("../../../models/SuperAdmin");
const tryCatch = require("../../../util/tryCatch");

const authorizeSuperAdmin=tryCatch(async(req,res,next)=>{
    const superAdmin=await SuperAdmin.findOne(); // there is only one super admin
    if(req.user.id==superAdmin.adminId){
        return next();
    }
    throw new AuthorizationError();
});
module.exports=authorizeSuperAdmin;
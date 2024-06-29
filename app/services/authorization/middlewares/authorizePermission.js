const authorizePermission=(permission)=>{
    const Authorize = require("../Authorize");
    new Authorize().addPermission(permission);
    return (req,res,next)=>{
        
        next();
    }
};

module.exports=authorizePermission;

const Authenticate = require("../services/authentication/Authenticate");
const tryCatch = require("../util/tryCatch");

exports.postLogin=tryCatch(async(req,res,next)=>{
    // test
    const {passed,error}=await new Authenticate().attemp(req);
    if(passed)return res.send({status:true,message:'Authenticated'});
    res.status(401).send({status:false,error});
}) ;


exports.logout=()=>{};
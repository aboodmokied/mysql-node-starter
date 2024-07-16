const Register = require("../../services/registration/Register");
const tryCatch = require("../../util/tryCatch");


exports.register=tryCatch(async(req,res,next)=>{
    // Before: guard and user data validation required, check if user exist.
    const {guard}=req.body;
    const user=await new Register().withGuard(guard).create(req);
    res.status(201).send({status:true,result:{user}});
});

exports.login=tryCatch(async(req,res,next)=>{

})
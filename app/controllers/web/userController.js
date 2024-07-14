const authConfig = require("../../config/authConfig");
const tryCatch = require("../../util/tryCatch");

exports.index=tryCatch(async(req,res,next)=>{
    // BEFORE: type validation
    const {guard}=req.params;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.mainProvider]?.model;
    const users=await model.findAll({where:{guard:guard}});
    req.session.pagePath=req.path;
    res.render('user/users',{
        pageTitle:guard,
        users,
        guard
    })
})
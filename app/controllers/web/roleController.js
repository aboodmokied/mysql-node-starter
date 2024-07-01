const Role = require("../../models/Role")
const tryCatch = require("../../util/tryCatch")

exports.index=tryCatch(async(req,res,next)=>{
    const roles=await Role.findAll();
    res.send({status:true,result:roles});
})

exports.create=tryCatch((req,res,next)=>{
    
})

exports.store=tryCatch(async(req,res,next)=>{
    const {name}=req.body;
    const result=await Role.create({name});
    res.send({status:true,result});
})

exports.show=tryCatch(async(req,res,next)=>{
    const {roleId}=req.params;
    const role=await Role.findByPk(roleId);
    const rolePermissions=await role.getPermissions();
    const availablePermissions=await role.getAvailablePermissions();
    res.send({status:true,result:{
        rolePermissions,
        availablePermissions
    }});
})

exports.assignPermission=tryCatch(async(req,res,next)=>{
    const {role,permission}=req.body;
    const result=await Role.assignPermission(role,permission);
    res.send({status:true,result});
})

exports.revokePermission=tryCatch(async(req,res,next)=>{
    const {role,permission}=req.body;
    const result=await Role.revokePermission(role,permission);
    res.send({status:true,result});
})


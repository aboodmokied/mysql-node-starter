const { Op } = require("sequelize");
const Permission = require("../../models/Permission");
const Role = require("../../models/Role");
const RoleHasPermission = require("../../models/RoleHasPermission");
const UserHasRole = require("../../models/UserHasRole");
const authConfig = require("../../config/authConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const Application = require("../../Application");

class Authorize{
    #permissions=new Set();
    constructor(){
        return Authorize.instance??=this;
    }
    
    get permissions(){
        return this.#permissions;
    }

    addPermission(permission){
        this.#permissions.add(permission);
    }

    async setup(){
        await this.#definePermissions();
        await this.#defineRoles();
    }

    applyAuthorization(model){
        this.#permissionAggregationFunctions(model);
        this.#roleAggregationFunctions(model);
    }
    #roleAggregationFunctions(model){
        // Before: validate role existence
        // Class Level
            model.hasRole=async function(userId){
                const count=await Role.count({
                    include:{model:model,through:UserHasRole,where:{id:userId},required:true}
                })
                return count?true:false;
            }

            model.assignRole=async function(role,userId){
                const roleInstance=await Role.findOne({where:{[Op.or]:[{name:role},{id:role}]}});
                if(roleInstance.isMain)throw new BadRequestError('Main Roles is not assignable')
                const count=await UserHasRole.count({where:{userId,roleId:roleInstance.id}});
                if(count){
                    throw new Error(`${role.name} already assigned to this user`)
                }
                const result=await UserHasRole.create({userId,roleId:roleInstance.id});    
                return result;
            }
            model.revokeRole=async function(role,userId){
                const roleInstance=await Role.findOne({where:{[Op.or]:[{name:role},{id:role}]}});
                if(roleInstance.isMain)throw new BadRequestError('Main Roles is not revokable')
                // const count=await UserHasRole.count({where:{userId,roleId:roleInstance.id}});
                // if(count){
                //     throw new Error(`${role.name} already assigned to this user`)
                // }
                const result=await UserHasRole.destroy({where:{userId,roleId:roleInstance.id}});    
                return result;
            }
            model.getRoles=async function(role,userId){
                const roles=await Role.findAll({
                    where:{[Op.or]:[{name:role},{id:role}]},
                    include:{model:model,through:UserHasRole,where:{id:userId},required:true}
                })
                return roles;
            }
            model.getAvaliableRoles=async function(userId){
                const roles=await Role.findAll({
                    where:{id:{[Op.notIn]:Application.connection.literal(`(SELECT roleId FROM user_has_roles WHERE userId=${userId}')`)}},
                })
                return roles;
            }

        // Instance Level
            model.prototype.hasRole=async function(role){
                const count=await Role.count({
                    where:{name:role},
                    include:{model:model,through:UserHasRole,where:{id:this.id},required:true}
                })
                return count?true:false;
            }
            model.prototype.assignRole=async function(role){
                const roleInstance=await Role.findOne({where:{[Op.or]:[{name:role},{id:role}]}});
                if(roleInstance.isMain)throw new BadRequestError('Main Roles is not assignable')
                const count=await UserHasRole.count({where:{userId:this.id,roleId:roleInstance.id}});
                if(count){
                    throw new Error(`${role.name} already assigned to this user`)
                }
                const result=await UserHasRole.create({userId:this.id,roleId:roleInstance.id});    
                return result;
            }

            model.prototype.revokeRole=async function(role){
                const roleInstance=await Role.findOne({where:{[Op.or]:[{name:role},{id:role}]}});
                if(roleInstance.isMain)throw new BadRequestError('Main Roles is not revokable')
                // const count=await UserHasRole.count({where:{userId,roleId:roleInstance.id}});
                // if(count){
                //     throw new Error(`${role.name} already assigned to this user`)
                // }
                const result=await UserHasRole.destroy({where:{userId:this.id,roleId:roleInstance.id}});    
                return result;
            }
            model.prototype.getRoles=async function(){
                const roles=await Role.findAll({
                    include:{model:model,through:UserHasRole,where:{id:this.id},required:true}
                })
                return roles;
            }
            model.prototype.getAvaliableRoles=async function(){
                const roles=await Role.findAll({
                    where:{id:{[Op.notIn]:Application.connection.literal(`(SELECT roleId FROM user_has_roles WHERE userId=${this.id}')`)}},
                })
                return roles;
            }
    }
    #permissionAggregationFunctions(model){
        // Class Level
        model.getPermissionsViaRoles=async function(userId){ // ***
            // let userPermissions=[];
            // const userRoles=await Role.findAll({include:[{model:model,through:UserHasRole,where:{id:userId},required:true},{model:Permission}]})
            // for(let role of userRoles){
            //     userPermissions=[...userPermissions,role.permissions];
            // }
            // const permissions=new Set(userPermissions);
            // // return permissions;
            const permissions=await Permission.findAll({
                include:{
                    model:Role,
                    through:RoleHasPermission,
                    required:true,
                    include:{model:model,through:UserHasRole,where:{id:userId},required:true}
                    }
                
            })
            return permissions;
        } 
        model.hasPermissionsViaRoles=async function(userId,permission){ // ***
            const permissionInstance=await Permission.findOne({
                where:{[Op.or]:[{name:permission},{id:permission}]},
                include:{
                    model:Role,
                    through:RoleHasPermission,
                    required:true,
                    include:{model:model,through:UserHasRole,where:{id:userId},required:true}
                    }
                
            })
            return permissionInstance?true:false;
        } 

        // Instance Level 
        model.prototype.getPermissionsViaRoles=async function(){ // ***
            const permissions=await Permission.findAll({
                include:{
                    model:Role,
                    through:RoleHasPermission,
                    required:true,
                    include:{model:model,through:UserHasRole,where:{id:this.id},required:true}
                    }
                
            })
            return permissions;
        } 
        model.prototype.hasPermissionsViaRoles=async function(permission){ // ***
            const permissionInstance=await Permission.findOne({
                where:{[Op.or]:[{name:permission},{id:permission}]},
                include:{
                    model:Role,
                    through:RoleHasPermission,
                    required:true,
                    include:{model:model,through:UserHasRole,where:{id:this.id},required:true}
                    }
            })
            return permissionInstance?true:false;
        } 
    }

    async applySystemRoles(user){
        const {guard}=user;
        const roles=[];
        const guardRole=authConfig.guards[guard].role.name;
        const commonRole=authConfig.commonRole.name;
        roles.push(commonRole);
        roles.push(guardRole);
        for(let role of roles){
            const roleInstance=await Role.findOne({where:{name:role}});
            await UserHasRole.create({userId:user.id,roleId:roleInstance.id});
        }
    }
    // #superAdminAggregationFunctions(model){
    //     model.isSuperAdmin=async function(userId){
    //         const user=await model.findByPk(userId);
    //         if(user.guard=='admin',)
    //     }
    // }    
    async #definePermissions(){
        for(let per of this.#permissions){
                const count=await Permission.count({where:{name:per}})
                if(!count){
                    await Permission.create({name:per});
                }
            }
            
        }


    async #defineRoles(){
        let roles=Object.keys(authConfig.guards).map(guardName=>{
            const guardObj=authConfig.guards[guardName];
            return guardObj.role.name
        });
        roles=[authConfig.commonRole.name,...roles];
        for(let role of roles){
            const count=await Role.count({where:{name:role}})
            if(!count){
                await Role.create({name:role,isMain:true});
            }
        }
    }


    // async #defineRolePermissions(){
    //     const mainRoles=authorizationConfig.mainRoles;
    //     for(let role in mainRoles){
    //         const roleObj=mainRoles[role];
    //         const roleInstance=await Role.findOne({where:{name:role}});
    //         for(let permission of rolePermissions){
    //             const permissionInstance=await Permission.findOne({where:{name:permission}});
    //             const count=await RoleHasPermission.count({where:{roleId:roleInstance.id,permissionId:permissionInstance.id}})
    //             if(!count){
    //                 await roleInstance.addPermission(permissionInstance);
    //             }
    //         }
    //     }
    // }


}

module.exports=Authorize;
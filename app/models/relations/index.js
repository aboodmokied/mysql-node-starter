const AccessToken = require("../AccessToken");
const Permission = require("../Permission");
const Role = require("../Role");
const RoleHasPermission = require("../RoleHasPermission");
const SuperAdmin = require("../SuperAdmin");
const User = require("../User");
const UserHasRole = require("../UserHasRole");


// role - permission
Role.belongsToMany(Permission,{
    through:RoleHasPermission,
    foreignKey:'roleId',
    otherKey:'permissionId'
})

Permission.belongsToMany(Role,{
    through:RoleHasPermission,
    foreignKey:'permissionId',
    otherKey:'roleId'
})


// user - role
User.belongsToMany(Role,{
    through:UserHasRole,
    foreignKey:'userId',
    otherKey:'roleId'
})

Role.belongsToMany(User,{
    through:UserHasRole,
    foreignKey:'roleId',
    otherKey:'userId'
})


// AccessToken - User

User.hasMany(AccessToken,{
    foreignKey:'userId',
})

AccessToken.belongsTo(User,{
    foreignKey:'userId',
})
// roles via guard config
module.exports={
    mainRoles:['user','student'], // unable to delete or revoke
    defaultRoles:['user'], // shared between all registered users
    guardRoles:{
        student:['student'],
    },
}
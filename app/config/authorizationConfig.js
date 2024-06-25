// roles via guard config
module.exports={
    mainRoles:{ // unable to delete or revoke
        user:['permissions'],
        admin:[],
        student:[]
    }, 
    guardRoles:{ // by default assigned roles
        student:['user','student'],
        admin:['user','admin']
    },
}

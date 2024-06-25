const authConfig = require("../../config/authConfig");

class Authorize{
    constructor(){
        return Authorize.instance??=this;
    }

    setup(){
        const guards=authConfig.guards;
        
        // add aggreagations for models
        // create roles
        // assign roles for guards
    }
    #roleAggregationFunctions(model){

    }
    up(){
        // get all permissions is the code
        // add them to db
        // assign to roles ??
        // create super admin then assign his permissions
    }


}
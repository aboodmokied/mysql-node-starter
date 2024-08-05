class QueryFeatures{
    queryOptions={};
    constructor(queryStr){
        this.queryStr=queryStr;
    }
    
    // filtering
    filter(){
        const excludedParmas=['limit','page','fileds','sort'];
        const filteringProps={...this.queryStr};
        excludedParmas.forEach(ele=>{
            delete filteringProps[ele];
        });
        let filteringPropsAsStr=JSON.stringify(filteringProps);
        filteringPropsAsStr.replace(/\b(ne|gt|gte|lt|lte)\b/g,(match)=>`[Op.${match}]`);
        const where=JSON.parse(filteringPropsAsStr);
        queryOptions.where=where;
        return this;
    }
    // sort
    
    // limiting fileds

    // pagination

};

module.exports=QueryFeatures;


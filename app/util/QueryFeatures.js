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

        if(Object.keys(filteringProps).length){
            let filteringPropsAsStr=JSON.stringify(filteringProps);
            filteringPropsAsStr.replace(/\b(ne|gt|gte|lt|lte)\b/g,(match)=>`[Op.${match}]`);
            const where=JSON.parse(filteringPropsAsStr);
            this.queryOptions.where=where;
        }
        
        return this;
    }

    // sort
    sort(){
        /**
         * sort:'-price,age'
         * [['price','DESC'],['age','ASC']]
         * */ 
        if(this.queryStr.sort){
            const sortingProps=this.queryStr.sort.split(',');
            const propsArr=[];
            sortingProps.forEach(prop=>{
                let ord=null;
                let filed=prop;
                if(prop.startsWith('-')){
                    ord='DESC';
                    filed=prop.substring(1);
                }else{
                    ord='ASC';
                }
                propsArr.push([filed,ord]);
            });
            this.queryOptions.order=propsArr;
        }
        return this;
    }

    // limiting fileds

    // pagination

};

module.exports=QueryFeatures;


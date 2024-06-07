// for apply middlewares
const express=require('express');
const Kernal={
    global:[
        express.json(),
        express.urlencoded({extended:false})
    ],
    api:[],
    web:[]
}

module.exports=Kernal;
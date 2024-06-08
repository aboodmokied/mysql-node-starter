// for apply middlewares
const express=require('express');
const ErrorHandler = require('./middlewares/ErrorHandler');
const Kernal={
    global:[
        express.json(),
        express.urlencoded({extended:false})
    ],
    api:[],
    web:[],
    error:[ErrorHandler]
}

module.exports=Kernal;
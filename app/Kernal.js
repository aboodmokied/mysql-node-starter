// for apply middlewares
const express=require('express');
const ErrorHandler = require('./middlewares/ErrorHandler');
const requestLogger = require('./middlewares/requestLogger');
const Kernal={
    global:[
        express.json(),
        express.urlencoded({extended:false}),
        requestLogger
    ],
    api:[],
    web:[],
    error:[ErrorHandler]
}

module.exports=Kernal;
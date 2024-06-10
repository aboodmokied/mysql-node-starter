// for apply middlewares
const express=require('express');
const ErrorHandler = require('./middlewares/ErrorHandler');
const requestLogger = require('./middlewares/requestLogger');
const limiter = require('./middlewares/limiter');
const helmet=require('helmet');

const Kernal={
    global:[
        requestLogger,
        express.json(),
        express.urlencoded({extended:false}),
    ],
    security:[
        helmet(),
        limiter
    ],
    api:[],
    web:[],
    error:[ErrorHandler]
}

module.exports=Kernal;
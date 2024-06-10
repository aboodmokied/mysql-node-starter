// for apply middlewares
const express=require('express');
const ErrorHandler = require('./middlewares/ErrorHandler');
const requestLogger = require('./middlewares/requestLogger');
const limiter = require('./middlewares/limiter');
const helmet=require('helmet');
const xss=require('xss-clean');
const {payloadSize} = require('./config/securityConfig');
const Kernal={
    global:[
        requestLogger,
        express.json({limit:payloadSize}), // limiting the payload size for prevent denial-of-service (DoS) attacks
        express.urlencoded({limit:payloadSize,extended:true}), // limiting the payload size for prevent denial-of-service (DoS) attacks
        xss() //prevent Cross-Site Scripting (XSS) attacks
    ],
    security:[
        helmet(), // adds many security headers
        limiter  // prevent brute-force attacks
    ],
    api:[],
    web:[],
    error:[ErrorHandler]
}

module.exports=Kernal;
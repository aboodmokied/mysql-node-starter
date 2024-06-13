// for apply middlewares
const express=require('express');
const ErrorHandler = require('./middlewares/ErrorHandler');
const requestLogger = require('./middlewares/requestLogger');
const limiter = require('./middlewares/limiter');
const helmet=require('helmet');
const xss=require('xss-clean');
const {payloadConfig} = require('./config/securityConfig');
const cors = require('./middlewares/cors');
const verifyUser = require('./services/authentication/middlewares/verifyUser');
const session=require('express-session');
const Kernal={
    global:[
        requestLogger,
        express.json({limit:payloadConfig.maxSize}), // limiting the payload size for prevent denial-of-service (DoS) attacks
        express.urlencoded({limit:payloadConfig.maxSize,extended:true}), // limiting the payload size for prevent denial-of-service (DoS) attacks
        xss(), //prevent Cross-Site Scripting (XSS) attacks
        session({
            secret: 'test', // Replace with a secret key of your choice
            resave: false, // Don't save session if unmodified
            saveUninitialized: true, // Save uninitialized sessions
            cookie: {
              secure: false, // Note: `secure` should be true in production when using HTTPS
              httpOnly: true // Ensures the cookie is not accessible via JavaScript
            }
          })
    ],
    security:[
        helmet(), // adds many security headers
        limiter,  // prevent brute-force attacks
        cors
    ],
    api:[],
    web:[verifyUser],
    error:[ErrorHandler]
}

module.exports=Kernal;
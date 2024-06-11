const rateLimit=require('express-rate-limit');
const RateLimitExceededError = require('../Errors/ErrorTypes/RateLimitExceededError');
const {rateLimitConfig} = require('../config/securityConfig');

const limiter=rateLimit({
    windowMs:rateLimitConfig.periodInMinutes * 60 * 1000,
    max:rateLimitConfig.times,
    handler: (req, res, next) => {
        next(new RateLimitExceededError());
    }
});

module.exports=limiter;
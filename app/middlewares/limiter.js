const rateLimit=require('express-rate-limit');
const RateLimitExceededError = require('../Errors/ErrorTypes/RateLimitExceededError');
const {rateLimit:config} = require('../config/securityConfig');

const limiter=rateLimit({
    windowMs:config.periodInMinutes * 60 * 1000,
    max:config.times,
    handler: (req, res, next) => {
        next(new RateLimitExceededError());
    }
});

module.exports=limiter;
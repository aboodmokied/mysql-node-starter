const cors=require('cors');
const {corsConfig}=require('../config/securityConfig');
const CorsError = require('../Errors/ErrorTypes/CorsError');
const corsOptions={
    origin: (origin, callback) => {
        if (corsConfig.allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new CorsError());
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

module.exports=cors(corsOptions)
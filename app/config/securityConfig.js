module.exports={
    rateLimitConfig:{
        periodInMinutes:15,
        times:100
    },
    payloadConfig:{ 
        maxSize:'100kb'
    },
    corsConfig:{
        allowedOrigins:[['https://www.yoursite.com', 'http://localhost:5500']],
    
    }
}
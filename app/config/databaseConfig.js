module.exports={
    default:'mysql',
    connections:{
        mysql:{
            dialect:process.env.DB_DIALECT,
            database:process.env.DB_NAME,
            username:process.env.DB_USER,
            password:process.env.DB_PASSWORD,
            host:process.env.DB_HOST,
                host:'localhost',
                password:'197508a',
                username:'root',
        },
        // ...
    }
}
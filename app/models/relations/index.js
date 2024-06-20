const Guard = require("../Guard");
const User = require("../User");

// user - guard
Guard.hasMany(User,{
    foreignKey: 'guardId'
});

User.belongsTo(Guard,{
    foreignKey: 'guardId'
})


const { validateEmail, validateEmailExistence, validateName, validateGuard, validatePassword, validateConfirmPassword, validateRegisterPassword, validateLoginPassword } = require("../validations");


exports.loginPageValidation=[
    validateGuard('param')
]
exports.loginValidation=[
    validateEmail,
    validateGuard('body'),
    validateLoginPassword
]

exports.registerPageValidation=[
    validateGuard('param')
]

exports.registerValidation=[
    validateEmail,
    validateEmailExistence,
    validateName,
    validateGuard('body'),
    validateRegisterPassword,
    validateConfirmPassword
]


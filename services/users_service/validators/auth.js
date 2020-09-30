const { check } = require('express-validator')

exports.userSignupValidator = [
    check('username')
        .not()
        .isEmpty()
        .withMessage('Username is required'),
    check('email')
        .isEmail()
        .withMessage('Email not valid.')
        .not()
        .isEmpty()
        .withMessage('Username is required'),
    check('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6, max: 32 })
        .withMessage('Password length must be between 6 and 32 characters')

]

exports.userSigninValidator = [
    check('email')
        .isEmail()
        .withMessage('Email not valid.')
        .not()
        .isEmpty()
        .withMessage('Username is required'),
    check('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6, max: 32 })
        .withMessage('Password length must be between 6 and 32 characters')

]
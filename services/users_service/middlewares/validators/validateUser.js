const { check } = require('express-validator')

exports.userSignupValidator = [
    check('username')
        .not()
        .isEmpty()
        .withMessage('Username is required'),
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('first name is required'),
    check('middleName')
        .not()
        .isEmpty()
        .withMessage('middle name is required'),
    check('lastName')
        .not()
        .isEmpty()
        .withMessage('last name is required'),
    check('email')
        .isEmail()
        .withMessage('Email not valid.')
        .not()
        .isEmpty()
        .withMessage('Email is required'),
    check("phoneNumber")
        .isNumeric()
        .withMessage("Phone number must be numeric")
        .trim()
        .escape(),
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

exports.userEditValidator = [
    check('username')
        .not()
        .isEmpty()
        .withMessage('Username is required'),
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('first name is required'),
    check('middleName')
        .not()
        .isEmpty()
        .withMessage('middle name is required'),
    check('lastName')
        .not()
        .isEmpty()
        .withMessage('last name is required'),
    check('email')
        .isEmail()
        .withMessage('Email not valid.')
        .not()
        .isEmpty()
        .withMessage('Email is required'),
    check("phoneNumber")
        .isNumeric()
        .withMessage("Phone number must be numeric")
        .trim()
        .escape()


]

exports.userForgotPasswordValidator = [
    check('email')
        .isEmail()
        .withMessage('Email not valid.')
        .not()
        .isEmpty()
        .withMessage('Email is required')
]

exports.userResetPasswordValidator = [
    check('newPassword')
        .not()
        .isEmpty()
        .withMessage("Please enter a value")
        .isLength({ min: 8 })
        .withMessage('Passwords must be atleast 8 characters'),
    check('confirmNewPassword')
        .not()
        .isEmpty()
        .withMessage("Please enter a value")
        .isLength({ min: 8 })
        .withMessage('Passwords must be atleast 8 characters')
]
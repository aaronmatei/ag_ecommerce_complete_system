const express = require('express')
const router = express.Router()

//import controller 
const { signup, accountActivation, signin } = require('../controllers/auth')

//import validator 
const { userSignupValidator, userSigninValidator } = require('../validators/auth')
const { runValidation } = require('../validators')

//register or signup 
router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/signin', userSigninValidator, runValidation, signin)
router.post('/account-activation', accountActivation)


module.exports = router
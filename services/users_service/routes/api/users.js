const express = require('express')
const router = express.Router()

//import controller 
const { signup, accountActivation, signin, editUser, getUser, deleteUser } = require('../../controllers/userController')

//import validator 
const { userSignupValidator, userSigninValidator, userEditValidator } = require('../../middlewares/validators/validateUser')
const { runValidation } = require('../../middlewares/validators')
const { auth } = require("../../middlewares/auth")

//@route GET /api/v1/users/userinfo 
//@desc GET user info
//@access: Private
router.get("/userinfo", auth, getUser)

//@route PUT /api/v1/users/edit_user
//@desc EDIT user info
//@access: Private
router.put("/edit_user", auth, userEditValidator, runValidation, editUser)

//@route POST /api/v1/users/signup
//@desc POST user info to create user
//@access: Public
router.post('/signup', userSignupValidator, runValidation, signup)

//@route POST /api/v1/users/signin 
//@desc POST user info to signup
//@access: Public
router.post('/signin', userSigninValidator, runValidation, signin)

//@route POST /api/v1/users/account_activation
//@desc POST user info (token) to activate account 
//@access: Public
router.post('/account_activation', accountActivation)

//@route DELETE /api/v1/users/:id/delete_account
//@desc DELETE user info
//@access: Private
router.delete('/:id/delete_account', auth, deleteUser)


module.exports = router
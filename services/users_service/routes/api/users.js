const express = require("express");
const router = express.Router();

//import controller
const {
    signup,
    accountActivation,
    signin,
    editUser,
    fetchAllUsers,
    getUser,
    deleteUser,
    resetPassword,
    forgotPassword
} = require("../../controllers/userController");

//import validator
const {
    userSignupValidator,
    userSigninValidator,
    userEditValidator,
    userForgotPasswordValidator,
    userResetPasswordValidator,
} = require("../../middlewares/validators/validateUser");
const { runValidation } = require("../../middlewares/validators");
const { auth } = require("../../middlewares/auth");

//@route GET /api/v1/users/user_info/:id
//@desc GET user info
//@access: Private
router.get("/user_info/:id", getUser);

//@route GET /api/v1/users/all_users
//@desc GET all users
//@access: Public
router.get("/all_users", fetchAllUsers)

//@route PUT /api/v1/users/edit_user/:id
//@desc EDIT user info
//@access: Private
router.put("/edit_user/:id", editUser);

//@route POST /api/v1/users/signup
//@desc POST user info to create user
//@access: Public
router.post("/signup", userSignupValidator, runValidation, signup);

//@route POST /api/v1/users/signin
//@desc POST user info to signup
//@access: Public
router.post("/signin", userSigninValidator, runValidation, signin);

//@route POST /api/v1/users/account_activation
//@desc POST user info (token) to activate account
//@access: Public
router.post("/account_activation", accountActivation);

//@route DELETE /api/v1/users/:id/delete_account
//@desc DELETE user info
//@access: Private
router.delete("/:id/delete_account", auth, deleteUser);

//@route PUT /api/v1/users/forgot_password
//@desc DELETE user info
//@access: Private
router.put("/forgot_password", userForgotPasswordValidator, runValidation, forgotPassword);

//@route PUT /api/v1/users/reset_password
//@desc RESET password
//@access: Private
router.put("/reset_password/:token", userResetPasswordValidator, runValidation, resetPassword);

module.exports = router;

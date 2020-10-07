const { User } = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const sendgridMail = require('@sendgrid/mail')
const jwtSecret = config.get("jwtSecret")
const bcrypt = require("bcryptjs")
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)


// functions 
// generate new token and send it with user 

// hande GET at /api/v1/users/userinfo
exports.getUser = async (req, res) => {
    await User
        .findById(req.user.id)
        .select("-password")
        .then(user => {
            res.json({
                user
            })
        })
        .catch(err => {
            res
                .status(400)
                .json({
                    message: "Cant find user",
                    error: err
                })
        })

}


// handle POST at /api/v1/users/signup
exports.signup = async (req, res) => {
    const { username, email, password, confirm_password } = req.body


    checkExistingUsername()

    // check existing username 
    async function checkExistingUsername() {
        await User
            .findOne({ username })
            .exec((err, existingUser) => {
                if (err) {
                    return res
                        .status(400)
                        .json({
                            message: "Error in getting username. Try again"
                        })
                } else if (existingUser) {
                    return res
                        .status(400)
                        .json({
                            message: "Username is already taken"
                        })
                } else {
                    checkExistingEmail()
                }

            })
    }


    // check username or email taken 
    async function checkExistingEmail() {
        await User.findOne({ email })
            .exec((err, userwithEmail) => {
                if (err) {
                    return res
                        .status(400)
                        .json({
                            message: "Error in getting email. Try again"
                        })


                } else if (userwithEmail) {
                    return res
                        .status(400)
                        .json({
                            message: 'That Email is in use'
                        })
                } else {
                    verifyUserPassword()
                }
            })
    }

    // verify password in UI 
    function verifyUserPassword() {
        if (password !== confirm_password) {
            res
                .status(400)
                .json({
                    message: "Passwords do not match"
                })
        } else {
            encryptPassAndSaveuser()
        }

    }

    // encrypt and save user
    function encryptPassAndSaveuser() {

        const newUser = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password
        })
        // encrypt password 
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err
                newUser.password = hash

                //save user to db
                newUser
                    .save()
                    .then(user => {
                        // sendAccountActivationEmail()
                        const { id, username, email, role } = user

                        // generate new token
                        function generateNewToken(user) {
                            return jwt.sign(
                                {
                                    id: user.id,
                                    username: user.username,
                                    email: user.email
                                },
                                jwtSecret,
                                { expiresIn: 3600 }
                                // (err, token) => {
                                //     if (err) {
                                //         console.log("Error token", err)
                                //         throw err
                                //     } else {
                                //         return token
                                //     }
                                // }
                            )
                        }
                        const token = generateNewToken(user)
                        res
                            .status(200)
                            .json({
                                token: token,
                                message: "Signup was successful",
                                user: {
                                    id,
                                    username,
                                    email,
                                    role
                                }
                            })
                    })
                    .catch(err => {
                        res
                            .status(400)
                            .json({
                                message: "Something went wrong while registering. Please try again later",
                                error: err
                            })
                    })

            })



        })

    }

    // send account activation to user email
    function sendAccountActivationEmail() {
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `account activation link`,
            html: `
                < h1 > Please use the link below to activate your account</h2 >
                    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    <hr /> 
                    <p>This email may contain sensitive information</p>
                    <p>@Rights Reserved. Company ${process.env.CLIENT_URL}</p>
                    `
        }
        console.log("email data", emailData)

        sendgridMail
            .send(emailData)
            .then(sent => {
                console.log('SIGN UP EMAIL SENT', sent)
                return res
                    .status(200)
                    .json({
                        message: `Email sent to ${email}.Follow instructions to activate account`
                    })
            })
            .catch(err => {
                console.log('SIGNUP EMAIL SENT ERROR', err)
                return res
                    .status(400)
                    .json({
                        message: err.message
                    })
            })



    }





}

// handle POST at /api/v1/users/account_activation
exports.accountActivation = (req, res) => {
    const { token } = req.body
    if (token) {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                console.log('JWT VERIFYING ACCOUNT ACTIVATION ERROR', err)
                return res
                    .status(401)
                    .json({
                        error: 'Expired link. Signup again'
                    })
            }

            const { id } = jwt.decode(token)
            User
                .findByIdAndUpdate(id,
                    {
                        isActive: true
                    },
                    {
                        new: true,
                        useFindAndModify: false
                    })
                .then(updatedUser => {
                    const { id, username, email, role } = updatedUser
                    res
                        .status(200)
                        .json({
                            message: "Account activation successfull",
                            updatedUser: {
                                id,
                                username,
                                email,
                                role
                            }
                        })
                })
                .catch(err => {
                    res
                        .status(400)
                        .json({
                            error: "Error in activating account. Please try again later",

                        })
                })

        })
    } else {
        return res
            .json({
                error: 'Something went wrong. Try again'
            })
    }

}

// handle POST at /api/v1/users/signin
exports.signin = async (req, res) => {
    const { email, password } = req.body
    await User
        .findOne({ email })
        .exec((err, user) => {
            if (err) {
                res
                    .status(400)
                    .json({
                        error: err
                    })
            }
            if (!user) {
                return res
                    .status(400)
                    .json({
                        error: 'Email provided not for a registered user. Please sign up'
                    })
            } else {
                comparePasswords(user)
            }

            //compare password function 
            function comparePasswords(user) {
                bcrypt
                    .compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            return res
                                .status(400)
                                .json({
                                    error: "Passwords do not match. Try again later"
                                })
                        } else {
                            generateSigninToken(user)

                        }
                    })


            }
            // generate new token and send it with user 
            function generateSigninToken(user) {
                const { id, username, email, role } = user
                jwt.sign(
                    {
                        id,
                        username,
                        email,
                    },
                    jwtSecret,
                    { expiresIn: 3600 },
                    (err, token) => {
                        if (err) {
                            res
                                .status(400)
                                .json({
                                    error: err.message
                                })

                        } else {
                            res
                                .status(200)
                                .json({
                                    token,
                                    message: "Sign in was successful",
                                    user: { id, username, email, role }
                                })
                        }
                    }
                )
            }



        })

}

// hande PUT at /api/v1/users/edit_user

exports.editUser = async (req, res) => {

    // generate new token and send it with user 
    function generateUserUpdatedToken(user) {
        const { id, username, email, role } = user
        jwt.sign(
            {
                id,
                username,
                email,
            },
            jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) {
                    res
                        .status(400)
                        .json({
                            error: err.message
                        })

                } else {
                    res
                        .status(200)
                        .json({
                            token,
                            message: "User information updated successfully",
                            user: { id, username, email, role }
                        })
                }
            }
        )
    }



    await User.findById(req.user.id, (err, userToUpdate) => {
        if (err) {
            res
                .status(400)
                .json({
                    message: "Error getting user"
                })
        } else {
            //create user with new data 
            let updatedUser = {
                username: req.body.username ? req.body.username : userToUpdate.username,
                firstName: req.body.firstName ? req.body.firstName : userToUpdate.firstName,
                middleName: req.body.middleName ? req.body.middleName : userToUpdate.middleName,
                lastName: req.body.lastName ? req.body.lastName : userToUpdate.lastName,
                email: req.body.email ? req.body.email : userToUpdate.email,
                phoneNumber: req.body.phoneNumber ? req.body.phoneNumber : userToUpdate.phoneNumber,
                password: req.body.password ? req.body.password : userToUpdate.password,
                gender: req.body.gender ? req.body.gender : userToUpdate.gender,
                nationality: req.body.nationality ? req.body.nationality : userToUpdate.nationality,
                birthdate: req.body.birthdate ? req.body.birthdate : userToUpdate.birthdate
            }

            // check email to avoid duplicates 
            if (userToUpdate.email === req.body.email) {
                // check if username is already taken
                User
                    .findOne({
                        username: req.body.username
                    }, (err, foundUser) => {
                        if (err) {
                            res
                                .status(400)
                                .json({
                                    message: "Error getting username"
                                })
                        } else if (foundUser) {
                            res
                                .status(400)
                                .json({
                                    message: "Username is already taken"
                                })

                        } else {
                            if (req.body.password !== req.body.confirm_password) {
                                return res
                                    .status(400)
                                    .json({
                                        message: "Passwords supplied do not match"
                                    })
                            } else {
                                // generate hashed password 
                                bcrypt.genSalt(10, (err, salt) => {
                                    if (err) throw err
                                    // if user didnt change password 
                                    if (req.body.password === "") {
                                        User
                                            .findByIdAndUpdate(req.user.id, updatedUser, {
                                                new: true,
                                                useFindAndModify: false
                                            })
                                            .select("-password")
                                            .then(user => {
                                                generateUserUpdatedToken(user)
                                            })
                                    } else {
                                        // if it was changed 
                                        bcrypt.hash(updatedUser.password, salt, (err, hash) => {
                                            if (err) throw err
                                            updatedUser.password = hash

                                        })
                                        User
                                            .findByIdAndUpdate(req.user.id, updatedUser, {
                                                new: true,
                                                useFindAndModify: false
                                            })
                                            .select("-password")
                                            .then(user => {
                                                generateUserUpdatedToken(user)
                                            })
                                    }
                                })


                            }
                        }

                    })
            } else {
                // email of user not same as suppplied 
                if (req.body.password !== req.body.confirm_password) {
                    return res
                        .status(400)
                        .json({
                            message: "Passwords supplied do not match"
                        })
                } else {
                    // check whether there exists a user with email supplied
                    User
                        .findOne({
                            email: req.body.email
                        }, (err, userwithEmail) => {
                            if (err) {
                                res
                                    .status(400)
                                    .json({
                                        message: "Error getting user with email supplied"
                                    })
                            } else if (userwithEmail) {
                                res
                                    .status(400)
                                    .json({
                                        message: "This email is for a registered user. Try with another one"
                                    })
                            } else {
                                User
                                    .findOne({
                                        username: req.body.username
                                    }, (err, foundUser) => {
                                        if (err) {
                                            res
                                                .status(400)
                                                .json({
                                                    message: "Error getting username"
                                                })
                                        } else if (foundUser) {
                                            res
                                                .status(400)
                                                .json({
                                                    message: "Username is already taken"
                                                })

                                        } else {
                                            if (req.body.password !== req.body.confirm_password) {
                                                return res
                                                    .status(400)
                                                    .json({
                                                        message: "Passwords supplied do not match"
                                                    })
                                            } else {
                                                // generate hashed password 
                                                bcrypt.genSalt(10, (err, salt) => {
                                                    if (err) throw err
                                                    // if user didnt change password 
                                                    if (req.body.password === "") {
                                                        User
                                                            .findByIdAndUpdate(req.user.id, updatedUser, {
                                                                new: true,
                                                                useFindAndModify: false
                                                            })
                                                            .select("-password")
                                                            .then(user => {
                                                                generateUserUpdatedToken(user)
                                                            })
                                                    } else {
                                                        // if it was changed 
                                                        bcrypt.hash(updatedUser.password, salt, (err, hash) => {
                                                            if (err) throw err
                                                            updatedUser.password = hash

                                                        })
                                                        User
                                                            .findByIdAndUpdate(req.user.id, updatedUser, {
                                                                new: true,
                                                                useFindAndModify: false
                                                            })
                                                            .select("-password")
                                                            .then(user => {
                                                                generateUserUpdatedToken(user)
                                                            })
                                                    }
                                                })


                                            }
                                        }

                                    })

                            }
                        })
                }


            }
        }
    })



}

// handle DELETE at /api/users/:id/delete_user
exports.deleteUser = async (req, res) => {
    await User
        .findById(req.params.id, (err, user) => {
            if (err) {
                return res
                    .status(400)
                    .json({
                        message: "Error in finding user with that id"
                    })

            } else if (user) {
                if (user.id !== req.user.id) {
                    return res
                        .status(400)
                        .json({
                            message: "Cannot delete user"
                        })
                } else {
                    User
                        .findByIdAndDelete(user.id, (err) => {
                            if (err) {
                                return res
                                    .status(400)
                                    .json({
                                        message: "could not delete user. try again later"
                                    })

                            } else {
                                return res
                                    .status(200)
                                    .json({
                                        message: "user account deleted successfully"
                                    })
                            }
                        })
                }
            } else {
                return res
                    .status(400)
                    .json({
                        message: "could not find user with that id"
                    })
            }

        })

}
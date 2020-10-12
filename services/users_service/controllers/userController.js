const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const _ = require("lodash")
const config = require("config");
const sendgridMail = require("@sendgrid/mail");
const jwtSecret = config.get("jwtSecret");
const bcrypt = require("bcryptjs");
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);


// hande GET at /api/v1/users/all_users
exports.fetchAllUsers = async (req, res) => {
    await User.find({}, '-password').exec((err, foundUsers) => {
        if (err) {
            res.status(400).json({
                message: "Could not fetch users",
                error: err.message
            })
        } else {
            res.status(200).json({
                users: foundUsers
            })
        }
    })
}

// hande GET at /api/v1/users/user_info/:id
exports.getUser = async (req, res) => {
    const userId = req.params.id;
    if (userId) {
        await User.findById(userId, "-password", (err, foundUser) => {
            if (err) {
                res.status(400).json({
                    message: "Cant find user",
                    error: err,
                });
            } else if (foundUser) {
                res.status(200).json({
                    user: foundUser,
                });
            }
        });
    } else {
        return res.status(403).json({
            message: "Could not find user",
        });
    }
};

// handle POST at /api/v1/users/signup
exports.signup = async (req, res) => {
    const { username, firstName, middleName, lastName, email, phoneNumber, password, confirm_password } = req.body;

    // new user will be
    const newUser = new User({
        username,
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        password
    });

    const signUpToken = generateNewToken(newUser)

    // generate new token
    function generateNewToken(user) {
        return jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
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
        );
    }

    checkExistingUsername();

    // check existing username
    async function checkExistingUsername() {
        await User.findOne({ username }).exec((err, existingUser) => {
            if (err) {
                return res.status(400).json({
                    message: "Error in getting username. Try again",
                });
            } else if (existingUser) {
                return res.status(400).json({
                    message: "Username is already taken",
                });
            } else {
                checkExistingEmail();
            }
        });
    }

    // check username or email taken
    async function checkExistingEmail() {
        await User.findOne({ email }).exec((err, userwithEmail) => {
            if (err) {
                return res.status(400).json({
                    message: "Error in getting email. Try again",
                });
            } else if (userwithEmail) {
                return res.status(400).json({
                    message: "That Email is in use",
                });
            } else {
                verifyUserPassword();
            }
        });
    }

    // verify password in UI
    function verifyUserPassword() {
        if (password !== confirm_password) {
            res.status(400).json({
                message: "Passwords do not match",
            });
        } else {
            encryptPassAndSaveuser();
        }
    }

    // encrypt and save user
    function encryptPassAndSaveuser() {
        // encrypt password
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;

                //save user to db
                newUser
                    .save()
                    .then((user) => {
                        sendAccountActivationEmail(user)
                    })
                    .catch((err) => {
                        res.status(400).json({
                            message: "Something went wrong while registering. Please try again later",
                            error: err,
                        });
                    });
            });
        });
    }

    // send account activation to user email
    function sendAccountActivationEmail(user) {
        const { id, username, email, role } = user;
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `account activation link`,
            html: `
                    <h1> Please use the link below to activate your account</h2>
                    <p>${process.env.CLIENT_URL}/auth/activate/${signUpToken}</p>
                    <hr /> 
                    <p>This email may contain sensitive information</p>
                    <p>@Rights Reserved. Company ${process.env.CLIENT_URL}</p>
                    `,
        };

        sendgridMail
            .send(emailData)
            .then((sent) => {
                return res.status(200).json({
                    message: `Signup was successful. Email sent to ${email}.Follow instructions to activate account`,
                    token: signUpToken,
                    user: {
                        id,
                        username,
                        email,
                        role,
                    }
                })

            })
            .catch((err) => {
                return res.status(400).json({
                    message: "Could not sign you up. Please try again later",
                    error: err.message,
                });
            });
    }
};

// handle POST at /api/v1/users/account_activation
exports.accountActivation = (req, res) => {
    const { token } = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    error: "Expired link. Signup again",
                });
            }

            const { id } = jwt.decode(token);
            User.findByIdAndUpdate(
                id,
                {
                    isActive: true,
                },
                {
                    new: true,
                    useFindAndModify: false,
                }
            )
                .then((updatedUser) => {
                    const { id, username, email, role } = updatedUser;
                    res.status(200).json({
                        message: "Account activation successfull",
                        updatedUser: {
                            id,
                            username,
                            email,
                            role,
                        },
                    });
                })
                .catch((err) => {
                    res.status(400).json({
                        error: "Error in activating account. Please try again later",
                    });
                });
        });
    } else {
        return res.json({
            error: "Something went wrong. Try again",
        });
    }
};

// handle POST at /api/v1/users/signin
exports.signin = async (req, res) => {
    const { email, password } = req.body;
    await User.findOne({ email }).exec((err, user) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        }
        if (!user) {
            return res.status(400).json({
                error: "Email provided not for a registered user. Please sign up",
            });
        } else {
            comparePasswords(user);
        }

        //compare password function
        function comparePasswords(user) {
            bcrypt.compare(password, user.password).then((isMatch) => {
                if (!isMatch) {
                    return res.status(400).json({
                        error: "Wrong password",
                    });
                } else {
                    generateSigninToken(user);
                }
            });
        }
        // generate new token and send it with user
        function generateSigninToken(user) {
            const { id, username, email, role } = user;
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
                        res.status(400).json({
                            error: err.message,
                        });
                    } else {
                        req.token = token;
                        res.header("x-auth-token", token).status(200).json({
                            token,
                            message: "Sign in was successful",
                            user: { token, id, username, email, role },
                        });
                    }
                }
            );
        }
    });
};

// hande PUT at /api/v1/users/edit_user/:id

exports.editUser = async (req, res) => {
    // generate new token and send it with user
    function generateUserUpdatedToken(user) {
        const { id, username, email, role } = user;
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
                    res.status(400).json({
                        error: err.message,
                    });
                } else {
                    console.log("USER TO UPDATEEE", user)
                    res.status(200).json({
                        token,
                        message: "User information updated successfully",
                        user: { id, username, email, role },
                    });
                }
            }
        );
    }

    const id = req.params.id;

    await User.findById(id, (err, userToUpdate) => {
        if (err) {
            res.status(400).json({
                error: "Error getting user",
            });
        } else {
            //create user with new data
            let updatedUser = {
                username: req.body.username ? req.body.username : userToUpdate.username,
                firstName: req.body.firstName
                    ? req.body.firstName
                    : userToUpdate.firstName,
                middleName: req.body.middleName
                    ? req.body.middleName
                    : userToUpdate.middleName,
                lastName: req.body.lastName ? req.body.lastName : userToUpdate.lastName,
                email: req.body.email ? req.body.email : userToUpdate.email,
                phoneNumber: req.body.phoneNumber
                    ? req.body.phoneNumber
                    : userToUpdate.phoneNumber,
                password: req.body.password ? req.body.password : userToUpdate.password,
                gender: req.body.gender ? req.body.gender : userToUpdate.gender,

                nationality: req.body.nationality
                    ? req.body.nationality
                    : userToUpdate.nationality,

                birthDate: req.body.birthDate
                    ? req.body.birthDate
                    : userToUpdate.birthDate,
            };
            console.log("INITIAL USER", userToUpdate);
            console.log("REQ BODY", req.body);

            // check email to avoid duplicates
            if (userToUpdate.email === req.body.email) {
                // check if new username in req.body is already taken
                User.findOne(
                    {
                        username: req.body.username,
                    },
                    (err, foundUser) => {
                        if (err) {
                            res.status(400).json({
                                error: "Error getting username",
                            });
                        } else if (foundUser) {
                            res.status(400).json({
                                error: "Username is already taken",
                            });
                        } else {
                            // check if passwords in req.body match
                            if (req.body.password !== req.body.verifyPassword) {
                                return res.status(400).json({
                                    error: "Passwordsssss supplied do not match",
                                });
                            } else {
                                // generate hashed password
                                bcrypt.genSalt(10, (err, salt) => {
                                    if (err) throw err;
                                    // if user didnt change password
                                    if (req.body.password === "") {
                                        User.findByIdAndUpdate(req.user.id, updatedUser, {
                                            new: true,
                                            useFindAndModify: false,
                                        })
                                            .select("-password")
                                            .then((user) => {
                                                generateUserUpdatedToken(user);
                                            });
                                    } else {
                                        // if it was changed
                                        bcrypt.hash(updatedUser.password, salt, (err, hash) => {
                                            if (err) throw err;
                                            updatedUser.password = hash;

                                            User.findByIdAndUpdate(req.user.id, updatedUser, {
                                                new: true,
                                                useFindAndModify: false,
                                            })
                                                .select("-password")
                                                .then((user) => {
                                                    generateUserUpdatedToken(user);
                                                });
                                        });
                                    }
                                });
                            }
                        }
                    }
                );

                // User has changed email
            } else {
                // email of existing user not same as suppplied in req.body
                if (req.body.password !== req.body.verifyPassword) {
                    return res.status(400).json({
                        error: "Passwordsz supplied do not match",
                    });
                } else {
                    // check whether there exists a user with req.body.email supplied
                    User.findOne(
                        {
                            email: req.body.email,
                        },
                        (err, userwithEmail) => {
                            if (err) {
                                res.status(400).json({
                                    error: "Error getting user with email supplied",
                                });
                            } else if (userwithEmail) {
                                res.status(400).json({
                                    error:
                                        "This email is for a registered user. Try with another one",
                                });
                            } else {
                                // check if req.body.username is taken
                                User.findOne(
                                    {
                                        username: req.body.username,
                                    },
                                    (err, foundUser) => {
                                        if (err) {
                                            res.status(400).json({
                                                error: "Error getting username",
                                            });
                                        } else if (foundUser) {
                                            res.status(400).json({
                                                error: "Username is already taken",
                                            });
                                        } else {
                                            if (req.body.password !== req.body.verifyPassword) {
                                                return res.status(400).json({
                                                    error: "Passwordszz supplied do not match",
                                                });
                                            } else {
                                                // generate hashed password
                                                bcrypt.genSalt(10, (err, salt) => {
                                                    if (err) throw err;
                                                    // if user didnt change password
                                                    if (req.body.password === "") {
                                                        User.findByIdAndUpdate(id, updatedUser, {
                                                            new: true,
                                                            useFindAndModify: false,
                                                        })
                                                            .select("-password")
                                                            .then((user) => {
                                                                generateUserUpdatedToken(user);
                                                            });
                                                    } else {
                                                        // if it was changed
                                                        bcrypt.hash(
                                                            updatedUser.password,
                                                            salt,
                                                            (err, hash) => {
                                                                if (err) throw err;
                                                                updatedUser.password = hash;

                                                                // update user
                                                                User.findByIdAndUpdate(
                                                                    id,
                                                                    updatedUser,
                                                                    {
                                                                        new: true,
                                                                        useFindAndModify: false,
                                                                    }
                                                                )
                                                                    .select("-password")
                                                                    .then((user) => {
                                                                        generateUserUpdatedToken(user);
                                                                    });
                                                            }
                                                        );
                                                    }
                                                });
                                            }
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        }
    });
};

// handle DELETE at /api/users/:id/delete_user
exports.deleteUser = async (req, res) => {
    await User.findById(req.params.id, (err, user) => {
        if (err) {
            return res.status(400).json({
                message: "Error in finding user with that id",
            });
        } else if (user) {
            if (user.id !== req.user.id) {
                return res.status(400).json({
                    message: "Cannot delete user",
                });
            } else {
                User.findByIdAndDelete(user.id, (err) => {
                    if (err) {
                        return res.status(400).json({
                            message: "could not delete user. try again later",
                        });
                    } else {
                        return res.status(200).json({
                            message: "user account deleted successfully",
                        });
                    }
                });
            }
        } else {
            return res.status(400).json({
                message: "could not find user with that id",
            });
        }
    });
};

// handle PUT at /api/users/forgot_password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    // generate new token and send it with user
    function generateForgotPasswordToken(user) {
        const { id, username, email, role } = user;
        jwt.sign(
            {
                id,
                username,
                email,
            },
            jwtSecret,
            { expiresIn: 36000 },
            (err, token) => {
                if (err) {
                    res.status(400).json({
                        message: "Could not generate token",
                        error: err.message,
                    });
                } else if (token) {
                    sendResetPasswordEmail(token)
                }
            }
        );
    }

    // send reset password link to user email
    function sendResetPasswordEmail(token) {
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Password reset link`,
            html: `
                        <h1> Please use the link below to reset your password</h2>
                            <p>${process.env.CLIENT_URL}/auth/user/reset_password/${token}</p>
                            <hr /> 
                            <p>This email may contain sensitive information</p>
                            <p>@Rights Reserved. Company ${process.env.CLIENT_URL}</p>
                            `,
        };

        sendgridMail
            .send(emailData)
            .then((sent) => {
                return res.status(200).json({
                    message: `Email to reset password has been sent to ${email}.Follow instructions to reset your password`,
                });
            })
            .catch((err) => {
                return res.status(400).json({
                    message: "Could not send email for you to reset password",
                    error: err.message
                });
            });
    }

    await User.findOne({ email }).exec((err, userwithEmail) => {
        if (err || !userwithEmail) {
            return res.status(400).json({
                message: "Cant find user with that email",
            });
        } else {
            generateForgotPasswordToken(userwithEmail);
        }
    });
};

// handle PUT at /api/users/reset_password/:token
exports.resetPassword = async (req, res) => {
    let token = req.params.token
    console.log("TOKENN", token)
    const { newPassword, confirmNewPassword } = req.body

    verifyUserPassword()

    // verify the 2 passwords in UI
    function verifyUserPassword() {
        if (newPassword !== confirmNewPassword) {
            res.status(400).json({
                error: "Passwords do not match",
            });
        } else {
            encryptPasswordsAndSave();
        }
    }

    // verify token 
    function encryptPasswordsAndSave() {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                console.log("TOKEN", token)
                res.status(400).json({
                    error: "Reset password link expired. Try again",
                })
            } else if (decoded) {
                console.log("TOKENNN", token)
                const { id } = jwt.decode(token)

                // encrypt newPassword 
                // generate hashed password
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(
                        newPassword,
                        salt,
                        (err, hash) => {
                            if (err) throw err;

                            // update user
                            // updatedFields = {
                            //     password: hash
                            // }
                            // user = _.extend(user, updatedFields)

                            User.findByIdAndUpdate(
                                id,
                                { password: hash },
                                {
                                    new: true,
                                    useFindAndModify: false,
                                }
                            )
                                .select("-password")
                                .then((user) => {
                                    generateResetPasswordToken(user);
                                });
                        }
                    );

                });

            }
        })
    }

    // generate new token and send it with user
    function generateResetPasswordToken(user) {
        const { id, username, email } = user;
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
                    res.status(400).json({
                        message: "Could not generate token",
                        error: err.message,
                    });
                } else if (token) {
                    res.status(200).json({
                        message: "Password has been reset successfully. Login using new password",
                        newUser: user
                    })
                }
            }
        );
    }

};

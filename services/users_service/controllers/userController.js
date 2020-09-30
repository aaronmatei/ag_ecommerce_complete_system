const { User } = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const sendgridMail = require('@sendgrid/mail')
const jwtSecret = config.get("jwtSecret")
const bcrypt = require("bcryptjs")
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)



exports.signup = async (req, res) => {
    const { username, email, password, verifyPassword } = req.body

    checkExistingUsername()

    // check existing username 
    function checkExistingUsername() {
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
    function checkExistingEmail() {
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
                            error: 'Email is in use'
                        })
                } else {
                    verifyUserPassword()
                }
            })
    }

    // verify password in UI 
    function verifyUserPassword() {
        if (password !== verifyPassword) {
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
        sendAccountActivationEmail()
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
            })
            //save user to db
            newUser
                .save()
                .then(user => {
                    const token = generateNewToken()
                    res.
                        status(200)
                        .json({
                            token,
                            user
                        })
                })
                .catch(err => {
                    res
                        .status(400)
                        .json({
                            message: "Error in registering. Please try again later",
                            error: err
                        })
                })

        })

    }

    // send account activation to user email
    function sendAccountActivationEmail() {
        const token = generateNewToken()
        const emailData = {
            from: process.env.EMAIL_TO,
            to: email,
            subject: `account activation link`,
            html: `
                    <h1>Please use the link below to activate your account</h2>
                    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    <hr /> 
                    <p>This email may contain sensitive information</p>
                    <p>@Rights Reserved. Company ${process.env.CLIENT_URL}</p>
                    `
        }

        sendgridMail
            .send(emailData)
            .then(sent => {
                console.log('SIGN UP EMAIL SENT', sent)
                return res
                    .status(200)
                    .json({
                        message: `Email sent to ${email}. Follow instructions to activate account`
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



    // generate new token and send it with user 
    function generateNewToken(user) {
        return jwt.sign(
            {
                id: user.id,
                username,
                email,
                password
            },
            jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) {
                    throw err
                } else {
                    // TODO: set token to headers
                    return token
                }
            }
        )
    }

}


exports.accountActivation = (req, res) => {
    // TODO:
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

            const { username, email, password } = jwt.decode(token)
            const newUser = new User({
                username,
                email,
                password,
            })



        })
    } else {
        return res.json({
            message: 'Something went wrong. Try again'
        })
    }

}

exports.signin = (req, res) => {
    const { email, password } = req.body
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'Email not for a registered user. Please sign up'
            })
        }
        //authenticate user 
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match'
            })
        }

        //generate token and send to client 
        const token = jwt.sign({ _id: user._id }, config.get('jwtSecret'), { expiresIn: '7d' })
        const { _id, username, email, role } = user
        return res.json({
            token: token,
            user: { _id, username, email, role }
        })


    })

}

exports.editUser = (req, res) => {

}
exports.editUser = (req, res) => {

}
const { User } = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const sendgridMail = require('@sendgrid/mail')
const { use } = require('../routes/auth')
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)



exports.signup = async (req, res) => {
    const { username, email, password } = req.body
    await User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email in use'
            })
        }

        const token = jwt.sign({ username, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' })
        const emailData = {
            from: process.env.EMAIL_TO,
            to: email,
            subject: `account activation link`,
            html: `
            <h1>Please use the link below to activate your account</h2>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            <hr /> 
            <p>This email may contain sensitive information</p>
            <p>@Rights Reserved. DevsCorner ${process.env.CLIENT_URL}</p>
            `
        }
        sendgridMail
            .send(emailData)
            .then(sent => {
                console.log('SIGN UP EMAIL SENT', sent)
                return res.status(200).json({
                    message: `Email sent to ${email}. Follow instructions to activate account`
                })
            }).catch(err => {
                console.log('SIGNUP EMAIL SENT ERROR', err)
                return res.status(400).json({
                    message: err.message
                })
            })
    })




}


exports.accountActivation = (req, res) => {
    const { token } = req.body
    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {
            if (err) {
                console.log('JWT VERIFYING ACCOUNT ACTIVATION ERROR', err)
                return res.status(401).json({
                    error: 'Expired link. Signup again'
                })
            }
            const { username, email, password } = jwt.decode(token)
            const newUser = new User({ username, email, password })
            newUser.save((err, user) => {
                if (err) {
                    console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err)
                    return res.status(401).json({
                        error: 'Error saving user in the database. Try to sign up again'
                    })

                }
                return res.status(200).json({
                    message: 'Signup successful. You can now log in'
                })


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
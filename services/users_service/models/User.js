const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        max: 32
    },
    firstName: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    middleName: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    nationality: {
        type: String
    },
    birthDate: {
        type: Date,
        default: null
    },

    role: {
        type: String,
        default: 'subscriber'
    },

    isRestricted: {
        type: Boolean
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
)

//virtual 
// userSchema.virtual('password')
//     .set(function (password) {
//         this._password = password
//         this.salt = this.makeSalt()
//         this.hashed_password = this.encryptPassword(password)

//     })
//     .get(function () {
//         return this._password
//     })


//methods 
// userSchema.methods = {
//     authenticate: function (plainText) {
//         return this.encryptPassword(plainText) === this.hashed_password

//     },
//     encryptPassword: function (password) {
//         if (!password) return ''
//         try {
//             return crypto.createHmac('sha1', this.salt)
//                 .update(password)
//                 .digest('hex')

//         } catch (error) {
//             return ''

//         }
//     },
//     makeSalt: function () {
//         return Math.round(new Date().valueOf() * Math.random()) + ''
//     }
// }

const User = mongoose.model("User", userSchema)

exports.User = User
exports.userSchema = userSchema

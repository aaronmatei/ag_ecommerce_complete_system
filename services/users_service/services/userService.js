const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const User = db.User


async function authenticate({ username, password }) {
    const user = await User.findOne({ username })
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ sub: user.id }, config.get('jwtSecret'), { expiresIn: '7d' })
        return {
            ...user.toJSON(),
            token
        }
    }
}

async function getAll() {
    return await User.find()

}

async function getById(id) {
    return await User.findById(id)
}

async function create(userParam) {
    //validate 
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken'
    }
    const user = new User(userParam)
    //hash password 
    if (userParam.password) {
        user.password = bcrypt.hashSync(userParam.password, 10)
    }
    //save user 
    await user.save()
}

async function update(id, userParam) {
    const user = await User.findById(id)
    //validate 
    if (!user) throw 'User not found'
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken'
    }
    //hash password if it is entered 
    if (userParam.password) {
        userParam.password = bcrypt.hashSync(userParam.password, 10)
    }
    //copy userParam properties to user
    Object.assign(user, userParam)
    await user.save()

}

async function _delete(id) {
    await User.findByIdAndRemove(id)
}


module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
}
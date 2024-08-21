const uuid = require('uuid')
const HttpError = require('../models/http-error')
const {validationResult } = require('express-validator')
const User = require('../models/user')

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Kofi Manu',
        password: 'testing',
        email: 'test"gmail.com'
    }
]

const getUsers = async (req, res, next) => {
    let users;
    try { users = await User.find({}, '-password');
}
catch(err){
    const error = new HttpError('Fetching users failed, please try again later', 500)
    return next(error)

}
    res.json({ users: users.map(user => user.toObject({ getters: true}))})
}

const signup = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next ( new HttpError('Invalid inputs passed, please check your data', 422)
    )}

    const { name, password, email, places} = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch(err){
        const error = new HttpError('Signing up failed, please try again later', 500)
    return next(error)
    }

    if (existingUser){
        const error = new HttpError('User exists already, please login instead', 422)
    
    return next(error)
    }
    
    
    const createdUser = new User({
        name,
        email,
        image: `https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/crm/newyorkstate/GettyImages-486334510_CC36FC20-0DCE-7408-77C72CD93ED4A476-cc36f9e70fc9b45_cc36fc73-07dd-b6b3-09b619cd4694393e.jpg`,
        password,
        places
    })

    try{
        await createdUser.save()
    } catch(err) {
        const error = new HttpError('Signing up failed please try again', 500)
    
    return next(error)
}
    
    res.status(201).json({ user: createdUser.toObject({ getters: true}) })
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    const identifiedUser = DUMMY_USERS.find( u => u.email === email)
    
    
    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch(err){
        const error = new HttpError('Login failed, please try again later', 500)
    return next(error)
    }

    if (!existingUser || existingUser.password !== password){
        const error = new HttpError('Invalid credentials, login failed', 401)
    
    return next(error)
    }

    res.json({ message: 'Logged In'})
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
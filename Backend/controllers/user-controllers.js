const uuid = require('uuid')
const HttpError = require('../models/http-error')
const {validationResult } = require('express-validator')

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Kofi Manu',
        password: 'testing',
        email: 'test"gmail.com'
    }
]

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS })
}

const signup = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data', 422)
    }
    const { name, password, email } = req.body

    const hasUser = DUMMY_USERS.fill(u => u.email === email)
    if (hasUser){
        throw new HttpError('Could not create user, email already exists', 422)
    }

    const createdUser = {
        id: uuid(),
        name, //name: name
        password,
        email
    } 

    DUMMY_USERS.push(createdUser)

    res.status(201).json({ user: createdUser })
}

const login = (req, res, next) => {
    const { email, password } = req.body;
    const identifiedUser = DUMMY_USERS.find( u => u.email === email)
    
    if(!identifiedUser || identifiedUser.password !== password){
        throw new HttpError('User is not identified, credentials dont match')
    }
    res.json({ message: 'Logged In'})

}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login
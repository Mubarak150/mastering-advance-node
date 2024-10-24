const User = require('../models/User');
const ApiFeatures = require('../Utils/ApiFeatures'); 
const {CustomError, makeError} = require('../Utils/CustomError'); 
const asyncErrorHandler = require('../Utils/asyncErrorHandler'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
require('dotenv').config();  

const generateToken = user =>  jwt.sign({ id: user._id }, process.env.TOKEN_KEY, { expiresIn: process.env.LOG_IN_EXPIRES_IN }); 

const signup = asyncErrorHandler( async (req, res, next) => {
    const newUser = await User.create(req.body); 

    const token = generateToken(newUser); 

    res.status(201).json({
        status: true,
        message: 'user created successfully',
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }, 
        token
    })
})

const login = asyncErrorHandler( async (req, res, next) => {

    const {email, password} = req.body; 
    if(!email || !password) return makeError('Both email and password are mandatory for logging in', 400, next)

    const user = await User.findOne({email}).select('+password')
    if (!user) return makeError('No user found with this email', 404, next);

    const isMatch = await bcrypt.compare(password, user.password); 
    if(!isMatch) return makeError('Password is incorrect', 400, next);

    const token = generateToken(user); 
    res.status(200).json({
        status: true, 
        token, 
        id: user._id
    })
})

module.exports = { signup, login }
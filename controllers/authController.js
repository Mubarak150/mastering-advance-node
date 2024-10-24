const User = require('../models/User');
const ApiFeatures = require('../Utils/ApiFeatures'); 
const CustomError = require('../Utils/CustomError'); 
const asyncErrorHandler = require('../Utils/asyncErrorHandler'); 

const signup = asyncErrorHandler( async (req, res, next) => {
    const newUser = await User.create(req.body); 

    res.status(200).json({
        status: true,
        user: newUser,  
        message: 'user created successfully'
    })
})

module.exports = {
    signup
}
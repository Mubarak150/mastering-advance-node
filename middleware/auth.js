const asyncErrorHandler = require('../Utils/asyncErrorHandler'); 
const util = require('util'); 
const jwt = require('jsonwebtoken'); 
const {makeError} = require('../Utils/CustomError'); 

const protect = asyncErrorHandler( async (req, res, next) => {
    // 1. read the token && check if the token exists:
    const testToken = req.headers.authorization;
    
    let token; 
    if(testToken && testToken.startsWith("Bearer ")) token = testToken.split(' ')[1];   

    if(!token) return makeError('you are not logged in!', 401, next) // unauthorized 

    // 2. validate the token: 
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.TOKEN_KEY);  // promisifying a non-promise-returning thing with utils lib of node. 
    if(!decodedToken) return makeError('token is expired and is not valid', 401, next); 

    // 3. if the user exists: 

    // 4. is his/her password the same as at the time of token generation: 

    // 5. letting him access the route handler: 
    next(); 
})


module.exports = { protect }
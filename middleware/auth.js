const asyncErrorHandler = require('../Utils/asyncErrorHandler'); 
const util = require('util'); 
const jwt = require('jsonwebtoken'); 
const {makeError} = require('../Utils/CustomError'); 
const User = require('../models/User'); 

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
    const user_id = decodedToken.id; 
    
    const user = await User.findOne({_id: user_id});
    if(!user) return makeError('the user with this token does not exists anymore.', 401, next); 

    // 4. letting him access the route handler:
    req.user = user; 
    next(); 
})

const allow = (...role) => {
    return (req, res, next) => !role.includes(req.user.role)  ? makeError(`${req.user.role}s are not allowed to access this route.`, 403, next) : next(); 
}

// const allow = (roles = []) => {
//     return (req, res, next) => {
//         const hasAccess = roles.some(role => (req.user.role == role))
//         return hasAccess ? next() : makeError(`${req.user.role}s are not allowed to access this route.`, 403, next)
//     }
// }


module.exports = { protect, allow }
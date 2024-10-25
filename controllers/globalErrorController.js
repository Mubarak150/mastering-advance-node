require("dotenv").config();
const {CustomError, makeError} = require('../Utils/CustomError'); 

// handle errors in development
const devError = (res, error) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error: error
    })
}

// hanlde errors in production
const prodError = (res, error) => {
    // | #security | is the error operational or not? if not operational i.e. not defined by us and is from server side etc. then dont show its details. 
    if(error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        })
    } 
    else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong. Please try again later!'
        })
    }
    
}

// handle a single sort of error, while in production:
// 1. video 96
const castErrorHandler = err => { // a type of mongoose error
    msg = `invalid value for the field ${err.path}: ${err.value}`
    const newError = new CustomError(msg, 400) // bad request
    return newError
}

// 2. video 97
const duplicateNameHandler = err => {
    const name = err.keyValue.name; 
    msg = `A movie already exists with the name ${name}.`
    const newError = new CustomError(msg, 400) // bad request
    return newError
}

// 3. video 98
const validatorErrorHandler = err => {
    let errors = Object.values(err.errors).map( val => val.message); 
    errors = errors.join('. '); // joinning errors array into a string. 
    const msg = `incorrect data: ${errors}` 
    const newError = new CustomError(msg, 400) // bad request
        return newError

    // this below is not used for now:
    // for (let key in err.errors) { // this is a for...in loop which loop in key value pairs within an object. key stores the key for each iteration
    //     const { message } = err.errors[key]; // Destructure the message ... with err.errors[key] we are accessing the value of that key in errors object. 
    //     const msg = (`Incorrect ${key}: ${message}`);
        
    //     // here we are taking the first iteration of that loop and returning the error without waiting for the rest of iterations. one error at a time.. haha. jugaarh
    //     const newError = new CustomError(msg, 400) // bad request
    //     return newError
    // }   
}

// video 108: 
const jwtExpiredHandler = err => {
    return new CustomError('your session has expired! please login again', 401) // unauthorized
}

const jwtErrorHandler = () => {
    return new CustomError('your session credentials are not valid', 401) // unauthorized
}

// main function: 
const globalErrorController = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500; 
    error.status = error.status || 'error';
    
    // note: sending different errors depending on dev env and prod env: in dev env send as much info about errors as possible... while in production env send as little info of the error as possible to avoid hacking or any ill-intended use of the site based on those error messages. 
    if(process.env.NODE_ENV === "development") {
        devError(res, error); 
    } else if (process.env.NODE_ENV === "production") {
        if(error.name == 'CastError')  error = castErrorHandler(error) // ObjectId() casting error 
        if(error.code == 11000)  error = duplicateNameHandler(error) // handling mongoose client error for duplicate entry in unique column
        if(error.name == 'ValidationError')  error = validatorErrorHandler(error) // mongoose validator error
        if(error.name == 'TokenExpiredError')  error = jwtExpiredHandler(error)
        if(error.name == 'JsonWebTokenError')  error = jwtErrorHandler(error)

        prodError(res, error);
    }
}

module.exports = {globalErrorController}
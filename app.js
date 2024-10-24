const express = require('express');
const app = express();
require("dotenv").config();
const morgan = require('morgan'); // it tells in short what happened to your request. hah
const authRouter = require('./routes/auth'); 
const homeRouter = require('./routes/home')
const moviesRouter = require('./routes/movies')
const {CustomError} = require('./Utils/CustomError');
const {globalErrorController} = require('./controllers/globalErrorController');  


app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('./public'))
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString(); 
    next(); 
})


app.use('/api/auth', authRouter); 

app.use('/home', homeRouter); 
app.use('/movies', moviesRouter); 


// default roue: this route SHALL be placed below all the defined routes...
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'failed',
    //     message: `the route ${process.env.ORIGIN}${req.originalUrl} does not exist on this server.`
    // })
    const error = new CustomError(`the route ${process.env.ORIGIN}${req.originalUrl} does not exist on this server.`, 404);
    // error.status = 'fail'; 
    // error.statusCode = 404; 
    next(error); 
})

// global Error Controller
app.use(globalErrorController)


module.exports = app; 
const express = require('express');
const app = express();
const morgan = require('morgan');
const homeRouter = require('./routes/home')
const moviesRouter = require('./routes/movies')


const logger = (req, res, next) => {
    console.log("logger executed successfully");
    next(); 
}

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('./public'))
app.use(logger);  // though logger is called after the morgan but still its print subseeds the morgan. whY? still dont know. 
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString(); 
    next(); 
})



app.use('/home', homeRouter); 
app.use('/movies', moviesRouter); 


module.exports = app; 
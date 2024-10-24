const mongoose = require('mongoose')
require("dotenv").config();

// synchronously handling unchaugt exceptions
process.on('uncaughtException', (error) => {
    console.log( error.name, error.message ); 
    console.log( 'an uncaught exception occured! shutting down...' ); 
    process.exit(1)
})

const app = require('./app');  

mongoose.connect(process.env.CONN_STR)
    .then(() => console.log('MongoDB connected!'))
    // .catch((error) => console.error('Connection error:', error)); // removing catch and handling it globally with process.

console.log(`The App is in ${app.get('env')}`) // this snippet gives us the environment in which the code is running.. i.e. dev, production, etc.


const server = app.listen((process.env.PORT), () => {
    console.log( `The App is listening on port ${process.env.PORT}`); 
});

// UPON unhandled error: log the error, close the server gracefully i.e. allowing it to complete pending requests and then th process is exited/ended.
process.on('unhandledRejection', (error) => {
    console.log( error.name, error.message ); 
    console.log( 'an unhandled rejection occured! shutting down...' ); 

    server.close(() => {
        process.exit(1)
    })
})
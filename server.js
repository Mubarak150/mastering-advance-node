const mongoose = require('mongoose')
require("dotenv").config();
const app = require('./app'); 

mongoose.connect(process.env.CONN_STR)
    .then(() => console.log('MongoDB connected!'))
    .catch((error) => console.error('Connection error:', error));
console.log(`The App is in ${app.get('env')}`) // this snippet gives us the environment in which the code is running.. i.e. dev, production, etc.


app.listen((3000), () => {
    console.log('app is listening on port 3000'); 
});
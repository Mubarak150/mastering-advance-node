const mongoose = require('mongoose'); 
const validator = require('validator'); 
const bcrypt = require('bcryptjs'); 

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'username is required']
    }, 
    email: {
        type: String, 
        required: [true, 'email is required'],
        unique: true, 
        validate: [validator.isEmail, 'email format not correct'] ,
        lowercase: true
    }, 
    password: {
        type: String, 
        required: [true, 'password is required'],
        minlength: [8, 'password must have atleast 8 characters'],
        select: false
    },
    confirmPassword: {
        type: String, 
        required: [true, 'please confirm your password'],
        validate: {
            validator: function (value) {
                return value === this.password // it will return a boolean value
            },
            message: 'both passwords should match' // custom error message if validator func returns false
        }
    },
    photo: String
}); 

userSchema.pre('save', async function(next){
    // only running the below code if the password was modified
    if(!this.isModified('password')) return next(); 

    // encrypt the password and save it back to the password... and undefine the confirm pass, as we dont need anymore. 
    this.password = await bcrypt.hash(this.password, 12); 
    this.confirmPassword = undefined; 

    next(); 
})

const User = mongoose.model('User', userSchema); 

module.exports = User; 
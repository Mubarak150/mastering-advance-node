const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'movie name is mandatory'],
        unique: true,
        minlength: [10, 'Movie name must be atleast 10 characters.'],
        maxlength: [100, 'Movie name must not exceed 100 characters.'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    duration: {
        type: Number, 
        required: [true, 'duration is mandatory for a movie']
    },
    ratings: {
        type: Number, 
        default: 2.5,
        // validators:
        // 1.  built-in validators
        // min: [1, 'ratings must be 1 or above.'],
        // max: [5, 'ratings must not exceed 5.']

        // 2. custom validator
        validate: {
            validator: function (value) {
                return value >= 1 && value <= 5 // it will return a boolean value
            },
            message: 'change rating value, {VALUE}, to be between 1 and 5, inclusive.' // custom error message if validator func returns false
        }
    },
    totalRating: {
        type: Number, 
    },
    releaseYear: {
        type: Number
    },
    releaseDate: {
        type: Date, 
        default: Date.now()
    },
    genres: {
        type: [String],
        required: [true, "genre is required"],
        enum: { // set of pre-defined values.
            values: ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Historical', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western', 'Family', 'Biography', 'Sports'],
            message: 'this genre does not exist'
        }
    },
    directors: {
        type: [String],
        required: [true, 'directors are required']
    },
    coverImage: {
        type: [String],
        required: [true, 'cover image is required']
    },
    actors: {
        type: [String],
        required: [true, 'actors is required']
    },
    price: {
        type: Number,
        required: [true, 'price is required']
    },
    createdAt: {
        type: Date, 
        default: Date.now(),
        // select: false // it indicates whether or not a data will be retrieved from the db when user requests to show all fields of this collection. 
    },
    createdBy: String,

}, {
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
});

// it is a virtual property which gets calculated at the time of get req. but does not exists in db document.
// use named function bcz we need $this which is not available for anonymous and arrow functions.  
movieSchema.virtual('durationInHours').get(function(){
    return `${Math.floor(this.duration / 60 )}h ${this.duration % 60}m`
})

// document middlewares: like express, mongoose also have middlewares, that runs between [for example: save() or create() or update() and actual manipulation in db... there are two kinds of it... ]

// below examples are for save()/create(): 
// 1.1. pre hook: runs before saving, updating etc... 
movieSchema.pre("save", function(next){
    this.createdBy = "Muhammad Mubarak"; 
    next(); 
})

// 1.2. post hook: runs after aforementioned tasks...
movieSchema.post('save', function(doc, next){ // takes the document and next func as parameters. 
    console.log(doc._id); // returnign the ID of saved document. 
    next();
})

// the basic diff b/w document and query middlewares are that doc returns doc , while query returns query parameter. 
// QUERY MIDDLEWARES: 
// 2.1. pre: 
movieSchema.pre(/^find/, function(next){ // regex stating all which start with word find: /^find/ 
    this.find({releaseDate: {$lte: Date.now() }});
    this.start = Date.now(); // saving op starts now... 
    next(); 
})

// 2.2 post: 
movieSchema.post(/^find/, function(docs, next){  
    console.log(`the time it took to find the docs was ${Date.now() - this.start} milliseconds.`)
    next(); 
})

// aggregation middlewares: 
// pre and post aggrigation: 
// 3.1. 
movieSchema.pre('aggregate', function(next){
    this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date()}}})
    console.log(this.pipeline()); 

    next()
})

const Movie = mongoose.model("Movie", movieSchema); 

module.exports = Movie; 
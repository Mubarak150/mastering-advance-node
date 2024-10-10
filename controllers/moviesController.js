const Movie = require('../models/Movie');
const ApiFeatures = require('../Utils/ApiFeatures'); 
const _ = require('lodash'); 

// 1. add a new movie
const addMovie = async (req, res) => {
    try{
        const request = req.body; 
        const movie = await Movie.create(request);

        res.status(201).json({
            status: true,
            data: movie
        })
        
    } catch(error) {
        console.log(error)
        res.status(400).json({
            status: false,
            message: error.message
            // message: error.message.split(':').pop().trim()
        })
    }

}

// 2. get a single movie
const getMovie = async (req, res) => {
    try{
        const {id} = req.params; 
        let movie = await Movie.findById(id);
        if(!movie) {
            res.status(404).json({status: false, message: "no movie found with given id"})
        }
        else {
            res.status(201).json({
                status: true,
                data: movie
            })
        }
        
        
    } catch(error) {
        console.log(error)
        res.status(400).json({
            status: false,
            message: error.message
        })
    } 
}

// 3. get all movies [subject to query conditions, if any]
const getAllMovies = async (req, res) => {
    try{ 
        // http://localhost:3000/movies/
        // example with query string advanced: http://localhost:3000/movies/?ratings[lte]=4.5&page[gt]=4&limit=32

        const features = new ApiFeatures(Movie.find(), req.query)
                                .filter()
                                .sort()
                                .limit_fields()
                                .paginate();
                                 
        let movies = await features.query; 
        // let pagesCount = moviesCount%limit !== 0 ? Math.trunc(moviesCount/limit) + 1 : moviesCount/limit; 
        
        res.status(201).json({
            status: true,
            count: movies.length,
            // pages: pagesCount,
            data: {movies}
        })
        
    } catch(error) {
        console.log(error)
        res.status(400).json({
            status: false,
            message: error.message
        })
    }  
}

// 4. update an existing movie by id
const updateMovie = async (req, res) => {
    try{
        let movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!movie) {
            res.status(404).json({ status: false, message: `no movie available with the id ${req.params.id}` })
        } else {
                res.status(201).json({
                status: true,
                message: "update successful",
                data: movie
            })
        }   
    } catch(error) {
        console.log(error)
        res.status(400).json({
            status: false,
            message: error.message
        })
    } 
}

// 5. delete a movie by id
const deleteMovie = async (req, res) => {
    try{
        let movie = await Movie.findByIdAndDelete(req.params.id);
        if(!movie) {
            res.status(404).json({ status: false, message: `no movie available with the id ${req.params.id}` })
        } else {
                res.status(201).json({
                status: true,
                message: "delete successful",
                data: movie
            })
        }
        
    } catch(error) {
        console.log(error)
        res.status(400).json({
            status: false,
            message: error.message
        })
    } 
}


// 6. get movies statistics
const getMoviesStats = async (req, res) => {
    try {
        const stats = await Movie.aggregate([
            { $match: { ratings: { $gte: 4.0 }}},
            { $group: {
                _id: '$releaseYear',
                avgRating:  { $avg: '$ratings'},
                avgPrice:   { $avg: '$price'},
                minPrice:   { $min: '$price'},
                maxPrice:   { $max: '$price'},
                totalPrice: { $sum: '$price'},
                movieCount: { $sum: 1 }
            }},
            { $sort:  { minPrice: 1}},
            { $match: { maxPrice: { $gte: 11 }}}
        ])

        res.status(200).json({
            success: true,
            count: stats.length,
            data: stats
        })

    } catch ( error ) {
        res.status(500).json({
            status: false,
            message: error    
        })
    }
}

// 7. get limited movies by genre
const getLimitedMoviesByGenre = async (req, res) => {
    try {
        const {genre, limit} = req.params; 
        const movies = await Movie.aggregate([
           { $unwind: '$genres' },                          // unwind genres array
           { $match: { genres: _.capitalize(genre) }},      // and match resultant genres = const genre; while capitalizing it... 
           { $sort: { ratings: -1 }},                       // sort by ratings in descending order
           { $limit: limit*1 }                              // limit the result upto the provided parameter. 
        ])

        res.status(200).json({
            success: true,
            count: movies.length,
            data: movies
        })

    } catch ( error ) {
        res.status(500).json({
            status: false,
            message: error    
        })
    }
}



module.exports = {
    addMovie,
    getMovie,
    getAllMovies,
    updateMovie,
    deleteMovie,
    getMoviesStats,
    getLimitedMoviesByGenre
}
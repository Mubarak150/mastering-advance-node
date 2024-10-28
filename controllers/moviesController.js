const Movie = require('../models/Movie');
const ApiFeatures = require('../Utils/ApiFeatures'); 
const {CustomError, makeError} = require('../Utils/CustomError'); 
const asyncErrorHandler = require('../Utils/asyncErrorHandler'); 
const _ = require('lodash'); 

// 1. add a new movie
const addMovie = asyncErrorHandler( async (req, res, next) => {
    const request = req.body; 
    const movie = await Movie.create(request);

    res.status(201).json({
        status: true,
        data: movie
    }) 
})



// 2. get a single movie
const getMovie = asyncErrorHandler( async (req, res, next) => {
    const {id} = req.params; 
    let movie = await Movie.findById(id);

    if(!movie) return makeError('movie with this ID not found!', 404, next);

    res.status(201).json({
        status: true,
        data: movie
    })
})


// 3. get all movies [subject to query conditions, if any]
const getAllMovies = asyncErrorHandler( async (req, res) => {
    // http://localhost:3000/movies/
    // example with query string advanced: http://localhost:3000/movies/?ratings[lte]=4.5&page[gt]=4&limit=32

    const features = new ApiFeatures(Movie.find(), req.query)
                            .filter()
                            .sort()
                            .limit_fields()
                            .paginate();
                                
    let movies = await features.query; 
    // let pagesCount = moviesCount%limit !== 0 ? Math.trunc(moviesCount/limit) + 1 : moviesCount/limit; 
    
    res.status(200).json({
        status: true,
        count: movies.length,
        // pages: pagesCount,
        data: {movies}
    })
})


// 4. update an existing movie by id
const updateMovie = asyncErrorHandler( async (req, res, next) => {
    let movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    if(!movie) return makeError('movie with this ID not found!', 404, next);

    res.status(201).json({
    status: true,
    message: "update successful",
    data: movie
    }) 
})


// 5. delete a movie by id
const deleteMovie = asyncErrorHandler( async (req, res, next) => {
    let movie = await Movie.findByIdAndDelete(req.params.id);

    if(!movie) return makeError('movie with this ID not found!', 404, next); 

    res.status(201).json({
    status: true,
    message: "delete successful",
    data: movie
    })
})


// 6. get movies statistics
const getMoviesStats = asyncErrorHandler( async (req, res) => {
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
})


// 7. get limited movies by genre
const getLimitedMoviesByGenre = asyncErrorHandler( async (req, res) => {
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
})



module.exports = {
    addMovie,
    getMovie,
    getAllMovies,
    updateMovie,
    deleteMovie,
    getMoviesStats,
    getLimitedMoviesByGenre
}
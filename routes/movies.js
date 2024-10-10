const express = require('express'); 
const router = express.Router(); 
const {
    addMovie,
    getMovie,
    getAllMovies,
    updateMovie,
    deleteMovie,
    getMoviesStats,
    getLimitedMoviesByGenre
} = require('../controllers/moviesController'); 


router.route('/')
    .get(getAllMovies)
    .post(addMovie)

router.route('/:id')
    .get(getMovie)
    .patch(updateMovie)
    .delete(deleteMovie)

router.get('/all/stats', getMoviesStats)
router.get('/genre/:genre/top/:limit', getLimitedMoviesByGenre)

module.exports = router; 
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


router.post('/', addMovie)
router.get('/', getAllMovies)
router.get('/:id', getMovie)
router.patch('/:id', updateMovie)
router.delete('/:id', deleteMovie)
router.get('/all/stats', getMoviesStats)
router.get('/genre/:genre/top/:limit', getLimitedMoviesByGenre)

module.exports = router; 
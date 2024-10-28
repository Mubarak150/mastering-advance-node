const express = require('express'); 
const router = express.Router();
const {protect, restrict, allow} = require('../middleware/auth'); 
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
    .get(protect, allow('admin'), getAllMovies) // allow middleware works for multiple too i.e. allow('admin', 'doctor') etc
    .post(addMovie)

router.route('/:id')
    .get(getMovie)
    .patch(updateMovie)
    .delete(deleteMovie)

router.get('/all/stats', getMoviesStats)
router.get('/genre/:genre/top/:limit', getLimitedMoviesByGenre)



module.exports = router; 
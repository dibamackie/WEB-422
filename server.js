require('dotenv').config();
const express = require('express');
const cors = require('cors');
const MoviesDB = require('./modules/moviesDB');

const app = express();
const db = new MoviesDB();

// Connect to MongoDB
db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => {
        console.log(`Error: ${err}`);
        process.exit(1);
    });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/movies', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const title = req.query.title;

        const movies = await db.getAllMovies(page, perPage, title);
        res.status(200).json(movies);
    } catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

app.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = await db.getMovieById(req.params.id);
        if (movie) {
            res.status(200).json(movie);
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (err) {
        console.error('Error fetching movie by ID:', err);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

app.post('/api/movies', async (req, res) => {
    try {
        const newMovie = await db.addNewMovie(req.body);
        res.status(201).json(newMovie);
    } catch (err) {
        console.error('Error adding new movie:', err);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

app.put('/api/movies/:id', async (req, res) => {
    try {
        const updatedMovie = await db.updateMovieById(req.body, req.params.id);
        if (updatedMovie) {
            res.status(200).json(updatedMovie);
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (err) {
        console.error('Error updating movie:', err);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

app.delete('/api/movies/:id', async (req, res) => {
    try {
        const deletedMovie = await db.deleteMovieById(req.params.id);
        if (deletedMovie) {
            res.status(200).json({ message: 'Movie successfully deleted' });
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (err) {
        console.error('Error deleting movie:', err);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

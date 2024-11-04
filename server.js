require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const MoviesDB = require('./modules/moviesDB'); // Import moviesDB module

const app = express();
const db = new MoviesDB();

// Connect to the MongoDB database using the connection string from .env
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error(`Error connecting to the database: ${err}`);
    process.exit(1); // Exit process with failure
  });

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests
app.use(express.static('public')); // Serve static files from the "public" folder

// RESTful API Endpoints
app.get('/api/movies', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const title = req.query.title;

    const movies = await db.getAllMovies(page, perPage, title);
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    const newMovie = await db.addNewMovie(req.body);
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

// Listen on a specified port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

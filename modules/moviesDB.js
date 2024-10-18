const mongoose = require('mongoose');

let isConnected = false; // Track the connection status

const MovieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    rated: String,
    released: Date,
    runtime: Number,
    genres: [String],
    directors: [String],
    writers: [String],
    actors: [String],
    plot: String,
    poster: String,
    imdb: {
        rating: Number,
        votes: Number
    },
    awards: {
        wins: Number,
        nominations: Number,
        text: String
    }
}, { collection: 'movies' }); // Explicitly define the collection name as 'movies'

const Movie = mongoose.model('Movie', MovieSchema);

class MoviesDB {
    constructor() {
        this.Movie = Movie;
    }

    async initialize(connectionString) {
        if (!isConnected) {
            try {
                await mongoose.connect(connectionString, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                isConnected = true;
                console.log('Connected to MongoDB: sample_mflix database.');
            } catch (err) {
                console.error('Error connecting to MongoDB:', err);
                throw err;
            }
        }
    }

    async addNewMovie(data) {
        const newMovie = new Movie(data);
        return await newMovie.save();
    }

    async getAllMovies(page, perPage, title) {
        let query = {};
        if (title) {
            query.title = new RegExp(title, 'i'); // Case-insensitive search by title
        }

        return await Movie.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();
    }

    async getMovieById(id) {
        return await Movie.findById(id).exec();
    }

    async updateMovieById(data, id) {
        return await Movie.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
    }

    async deleteMovieById(id) {
        return await Movie.findByIdAndDelete(id).exec();
    }
}

module.exports = MoviesDB;

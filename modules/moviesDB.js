const mongoose = require("mongoose");

let Movie;

class MoviesDB {
  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
          const movieSchema = new mongoose.Schema({
            plot: String,
            genres: [String],
            runtime: Number,
            cast: [String],
            poster: String,
            title: String,
            fullplot: String,
            languages: [String],
            released: Date,
            directors: [String],
            rated: String,
            awards: {
              wins: Number,
              nominations: Number,
              text: String,
            },
            imdb: {
              rating: Number,
              votes: Number,
              id: Number,
            }
          });

          // Define the model using the "movies" collection in the "sample_mflix" database
          Movie = mongoose.model("movies", movieSchema);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getAllMovies(page, perPage, title) {
    const query = title ? { title: new RegExp(title, "i") } : {};
    return Movie.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
  }

  getMovieById(id) {
    return Movie.findById(id).exec();
  }

  addNewMovie(data) {
    return Movie.create(data);
  }

  updateMovieById(data, id) {
    return Movie.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  deleteMovieById(id) {
    return Movie.findByIdAndDelete(id).exec();
  }
}

module.exports = MoviesDB;

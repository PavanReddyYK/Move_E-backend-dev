import movieModel from "../model/movieModel.mjs";
import watchListModel from "../model/watchListModel.mjs";
import mongoose from 'mongoose';

export const fetchAllMovies = async (req, res, next) => {
  try {
    const movies = await movieModel.find({
      poster: { $exists: true },
      year: { $gt: 2010 },
      "imdb.rating": { $gt: 2.4 },
      "imdb.votes": { $gt: 100000 },
    });
    // movies.map((m) => console.log(m.title));
    res.status(201).json({ message: "success", movies });
  } catch (error) {
    console.log("Error in fetching all the movies", error);
    next(error);
  }
};

export const fetchMovieById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const movie = await movieModel.findById(id);
    if (!movie) {
      console.log("no movie found");
      res.status(404).json({ message: `movie with ${id} not found` });
    } else {
      // console.log("🚀 ~ file: movieController.mjs:22 ~ fetchMovieById ~ movie:", movie)
      const movieData = {
        id: movie._id,
        title: movie.title,
        year: movie.year,
        type: movie.type,
        poster: movie.poster,
        genres: movie.genres,
        plot: movie.plot,
        cast: movie.cast,
        runtime: movie.runtime,
        imdb: {
          rating: movie.imdb.rating,
          votes: movie.imdb.votes,
        },
        awards: {
          wins: movie.awards.wins,
          nominations: movie.awards.nominations,
        },
        fullplot: movie.fullplot,
        released: movie.released,
        directors: movie.directors,
        writers: movie.writers,
      };
      res
        .status(200)
        .json({ message: `Successfully fetched movie by Id:${id}`, movieData });
    }
  } catch (error) {
    console.log(`Error in fetching movie by Id:${req.body.id}`, error);
    next(error);
  }
};

export const addMovieToWatchList = async (req, res, next) => {
  try {
    const { email, movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ message: "Invalid movieId", error: true });
    }

    const watchList = await watchListModel.findOneAndUpdate(
      { email },
      { $addToSet: { movies: movieId } }, // Add movieId as a string
      { new: true, upsert: true } // Create document if it doesn't exist
    );

    console.log("watchList", watchList);
    res.status(200).json({ message: "Added successfully", error: false });
  } catch (error) {
    console.log("Error adding movie to watchList: ", error);
    next(error);
  }
};

export const fetchMovieWatchList = async (req, res, next) => {
  try {
    const { email } = req.body;
    const watchList = await watchListModel.findOne({ email });
    if (watchList != null) {
      res.status(200).json({ watchList });
    } else {
      res.status(200).json({ message: "none" });
    }
  } catch (error) {
    console.log('fetchMovieWatchList error', error)
    next(error);
  }
};

export const removeWatchlist = async (req, res, next) => {
  try {
    const { email, movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ message: "Invalid movieId", error: true });
    }

    const watchList = await watchListModel.findOneAndUpdate(
      { email },
      { $pull: { movies: movieId } }, // Remove the string value matching movieId
      { new: true } // Return the updated document
    );

    if (!watchList) {
      return res.status(404).json({ message: "Watchlist not found", error: true });
    }
    
    res.status(200).json({ message: "Removed successfully", error: false });
  } catch (error) {
    console.log("Error removing movie from watchList: ", error);
    next(error);
  }
};

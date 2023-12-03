import movieModel from "../model/movieModel.mjs";
import watchListModel from "../model/watchListModel.mjs";

export const fetchAllMovies = async (req, res, next) => {
  try {
    const movies = await movieModel.find({
      poster: { $exists: true },
      year: { $gt: 2010 },
      "imdb.rating": { $gt: 7.0 },
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
      console.log(
        "🚀 ~ file: movieController.mjs:51 ~ fetchMovieById ~ movieData:",
        movieData
      );
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
    // const { email1} = req.data.email;
    // console.log("🚀 ~ file: movieController.mjs:70 ~ addMovieToWatchList ~ email1:", email1)
    console.log("email::::", email + "    movieid:::", movieId);

    const watchList = await watchListModel.findOneAndUpdate(
      { email },
      { $push: { movies: movieId } },
      { new: true, upsert: true } // The upsert option will create the user if not found
    );

    console.log("watchList", watchList);
    res.status(200).json({ message: "Added successfully", error: false });
  } catch (error) {
    console.log("Error adding movie to watchList: ", error);
    next(error);
  }
};

export const fetchMovieWatchList = async (req, res, next) => {
  const { email } = req.body;
  console.log("reqq!21", req.body);
  const watchList = await watchListModel.findOne({ email });

  if (watchList != null) {
    res.status(200).json({ watchList });
  } else {
    res.status(200).json({ message: "none" });
  }
};

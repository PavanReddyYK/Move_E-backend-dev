import movieModel from "../model/movieModel.mjs";

export const fetchAllMovies = async (req, res, next) => {
  try {
    const movies = await movieModel.find({
      poster: { $exists: true },
      year: { $gt: 2012 },
      "imdb.rating": { $gt: 8.1 },
    });
    movies.map((m) => console.log(m.title));
    res.status(201).json({ message: "success", movies });
  } catch (error) {
    console.log("Error in fetching all the movies", error);
    next(error);
  }
};

export const fetchMovieById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const movie = await movieModel.findById( id );
    if (!movie) {
      console.log("no movie found");
      res.status(404).json({ message: `movie with ${id} not found` });
    } else {
      console.log("🚀 ~ file: movieController.mjs:22 ~ fetchMovieById ~ movie:", movie)
      res
        .status(200)
        .json({ message: `Successfully fetched movie by Id:${id}`, movie });
    }
  } catch (error) {
    console.log(`Error in fetching movie by Id:${req.body.id}`, error);
    next(error);
  }
};

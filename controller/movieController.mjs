import movieModel from "../model/movieModel.mjs";

export const fetchAllMovies = async (req, res, next) => {
  try {
    const movies = await movieModel.find({'poster':{$exists: true},'year':{$gt: 2014},'imdb.rating':{$gt:8.5}});
    movies.map(m=>console.log(m.title))
    res.status(201).json({ message: "success", data: { movies } });
  } catch (error) {
    console.log("Error in fetching all the movies", error);
    next(error);
  }
};

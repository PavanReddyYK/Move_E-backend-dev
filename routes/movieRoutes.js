import express from "express";

import {
  addMovieToWatchList,
  fetchAllMovies,
  fetchMovieById,
  fetchMovieWatchList,
} from "../controller/movieController.mjs";
import { validate } from "../middleware/validator.mjs";

let routes = express.Router();

routes.get("/fetchAllMovies", fetchAllMovies);
routes.get("/fetchMovieById/:id", fetchMovieById);
routes.post("/addMovieToWatchlist", validate, addMovieToWatchList);
routes.post("/fetchMovieWatchList", validate, fetchMovieWatchList);

export default routes;

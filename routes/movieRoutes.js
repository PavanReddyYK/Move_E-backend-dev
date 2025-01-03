import express from "express";

import { validate } from "../src/middleware/validator.mjs";
import {
  addMovieToWatchList,
  fetchAllMovies,
  fetchMovieById,
  fetchMovieWatchList,
  removeWatchlist,
} from "../src/controller/movieController.mjs";

let routes = express.Router();

routes.get("/fetchAllMovies", fetchAllMovies);
routes.get("/fetchMovieById/:id", fetchMovieById);
routes.post("/addMovieToWatchlist", validate, addMovieToWatchList);
routes.post("/fetchMovieWatchList", validate, fetchMovieWatchList);
routes.post("/removeWatchlist", validate, removeWatchlist)

export default routes;

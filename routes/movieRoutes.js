import express from "express";

import { addMovieToWatchList, fetchAllMovies, fetchMovieById } from "../controller/movieController.mjs";

let routes = express.Router();

routes.get("/fetchAllMovies",fetchAllMovies );
routes.get("/fetchMovieById/:id",fetchMovieById );
routes.post("/addMovieToWatchlist",addMovieToWatchList );

export default routes;

import express from "express";

import { fetchAllMovies, fetchMovieById } from "../controller/movieController.mjs";

let routes = express.Router();

routes.get("/fetchAllMovies",fetchAllMovies );
routes.get("/fetchMovieById/:id",fetchMovieById );

export default routes;

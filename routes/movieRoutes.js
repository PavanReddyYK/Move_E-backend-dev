import express from "express";

import { fetchAllMovies } from "../controller/movieController.mjs";

let routes = express.Router();

routes.get("/fetchAllMovies",fetchAllMovies );


export default routes;

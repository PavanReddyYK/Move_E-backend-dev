import express from "express";
import { registerUser } from "../controller/userController.mjs";

let routes = express.Router()

routes.post('/registerUser',registerUser)
routes.post('/loginUser',registerUser)

export default routes;
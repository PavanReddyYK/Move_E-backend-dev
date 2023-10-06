import express from "express";
import { googleRedirectionURL, googleSignUp, registerUser } from "../controller/userController.mjs";

let routes = express.Router()

routes.post('/registerUser',registerUser)
routes.post('/googleSignUp',googleSignUp)
routes.get('/googleRedirectionURL',googleRedirectionURL)
routes.get('/userDAshboard')

routes.post('/loginUser',registerUser)

export default routes;
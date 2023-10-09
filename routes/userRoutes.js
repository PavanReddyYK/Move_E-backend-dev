import express from "express";
import {
  forgotPassword,
  googleRedirectionURL,
  googleSignUp,
  loginUser,
  registerUser,
  verifyPassword,
} from "../controller/userController.mjs";

let routes = express.Router();

routes.post("/registerUser", registerUser);
routes.post("/LogInUser", loginUser);
routes.post("/forgotPassword", forgotPassword);
routes.post("/verifyPassword", verifyPassword);
routes.post("/googleSignUp", googleSignUp);
routes.get("/googleRedirectionURL", googleRedirectionURL);

routes.post("/loginUser", registerUser);

export default routes;

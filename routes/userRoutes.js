import express from "express";
import {
  forgotPassword,
  googleRedirectionURL,
  googleSignUp,
  loginUser,
  logoutUser,
  registerUser,
  verifyOtp,
} from "../controller/userController.mjs";

let routes = express.Router();

routes.post("/registerUser", registerUser);
routes.post("/logInUser", loginUser);
routes.post("/logoutUser", logoutUser);
routes.post("/forgotPassword", forgotPassword);
routes.post("/verifyOtp", verifyOtp);
routes.post("/googleSignUp", googleSignUp);
routes.get("/googleRedirectionURL", googleRedirectionURL);

// routes.post("/loginUser", registerUser);

export default routes;

import express from "express";
import {
  contactMail,
  forgotPassword,
  googleRedirectionURL,
  googleSignUp,
  loginUser,
  logoutUser,
  registerUser,
  verifyOtp,
} from "../src/controller/userController.mjs";
import { validate } from "../src/middleware/validator.mjs";

let routes = express.Router();

routes.post("/registerUser", registerUser);
routes.post("/logInUser", loginUser);
routes.post("/logoutUser",validate, logoutUser);
routes.post("/forgotPassword", forgotPassword);
routes.post("/verifyOtp", verifyOtp);
routes.post("/googleSignUp", googleSignUp);
routes.get("/googleRedirectionURL", googleRedirectionURL);
routes.post("/contactMail",contactMail);

// routes.post("/loginUser", registerUser);

export default routes;

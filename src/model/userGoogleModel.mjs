import { Schema, model } from "mongoose";

const userGoogleSignUpModel = new Schema({
  sub: String,
  name: String,
  given_name: String,
  family_name: String,
  picture: String,
  email: String,
  email_verified: Boolean,
  local: String,
  token: String,
},
{ timestamps: true });

export default model("userGoogleSignIn", userGoogleSignUpModel);

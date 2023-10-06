import { Schema, model } from "mongoose";

const userGoogleSignUpModel = new Schema({
  sub: String,
  name: String,
  given_name: String,
  family_name: String,
  picture: String,
  email: {
    type: String,
    unique: true,
  },
  email_verified: Boolean,
  local: String,
  token: String,
});

export default model("userGoogleSignIn", userGoogleSignUpModel);

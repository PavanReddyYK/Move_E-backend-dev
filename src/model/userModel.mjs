import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    sub: String,
    name: String,
    given_name: String,
    family_name: String,
    picture: String,
    email: String,
    email_verified: Boolean,

    age: {
      type: Number,
      min: [8, "Age cannot be below 8 years"],
    },
    state: String,
    country: String,
    otp: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      minLength: [4, "Password should be a minimum of 4 characters"],
    },
  },
  { timestamps: true }
);


const user = model('user',userSchema)
export default user

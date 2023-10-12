import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: [4, "name should be minimum of 4 characters"],
      maxLength: [15, "name should not exceed 15 characters"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: [true, "age is mandatory"],
      min: [8, "age cannot be below 8 years"],
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    otp:{
      type:String,
      default:null
    },
    token:{
      type:String,
      default: null
    },
    password: {
      type: String,
      minLength: [4, "password should be minimum of 4 characters"],
      required: true,
    },
  },
  { timestamps: true }
);

const user = model('user',userSchema)
export default user

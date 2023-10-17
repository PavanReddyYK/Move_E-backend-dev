import { Schema, model } from "mongoose";

const watchListSchema = new Schema({
  email: String,
  movies: { type: [Object], unique: true }, // array of strings
});

export default model("watchlist", watchListSchema);

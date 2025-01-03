import { Schema, model } from "mongoose";

const watchListSchema = new Schema({
  email: { type: String, required: true, unique: true },
  movies: { type: [String] }, // Array of strings
});

export default model("watchlist", watchListSchema);

import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const db = mongoose
  .connect(process.env.REACT_APP_DEV_DB_URL)
  .then(() => {
      console.log("connected to database");
  })
  .catch((err) => {
    console.error("Error connecting to the DB");
  });
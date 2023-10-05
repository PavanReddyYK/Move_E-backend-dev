import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

mongoose
  .connect(process.env.REACT_APP_DEV_DB_URL)
  .then((result) => {
      console.log("connected to database");
    console.log("🚀 ~ file: connection.js:5 ~ .then ~ result:");
  })
  .catch((err) => {
    console.error("Error connecting to the DB");
  });

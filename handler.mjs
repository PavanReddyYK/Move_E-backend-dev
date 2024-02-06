import express from 'express';
const app = express()

import http from 'http';

import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({"extended":true}))
app.use(bodyParser.json())

import dotenv from 'dotenv';
dotenv.config();

import './dbConfig.js'

import cors from "cors";
app.use(cors());

import userRoutes from "./routes/userRoutes.js";
app.use('/v1/user/',userRoutes)

import movieRouter from "./routes/movieRoutes.js";
app.use('/v1/movie/',movieRouter)

// import pdfRouter from "./routes/pdfRoutes.js"
// app.use('/v1/pdf/',pdfRouter)






app.use("*",(req,res,next)=>{
    res.status(404).json({error:true,message:"Page Not Found!!!"})
})
app.use((err, req, res, next) => {
    console.log(`Path: ${req.path} -> Status Code: ${err.status || 500} -> Stack: ${err.stack}`)
    res.status(err.status || 500).send(err.message);
});


app.set('port',process.env.REACT_APP_PORT)
const server = http.createServer(app)

server.listen(app.get('port'),"0.0.0.0",()=>{
    console.log(`Express server listening on http://localhost:${app.get('port')}`)
});
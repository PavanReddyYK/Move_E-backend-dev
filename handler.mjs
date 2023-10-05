import express from 'express';
const app = express()

import http from 'http';

import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({"extended":true}))
app.use(bodyParser.json())

import dotenv from 'dotenv';
dotenv.config();

import './adapter/connection.js'

import cors from "cors";
app.use(cors());

import userRoutes from "./routes/userRoutes.js";
app.use('/v1/user/',userRoutes)










app.use("*",(req,res,next)=>{
    res.status(404).json({error:true,message:"Page Not Found!!!"})
})
app.use( (err,req,res,next)=>{
    res.status(400).json({error:true,message:err.message,data:"ok"})
} )

app.set('port',process.env.REACT_APP_PORT)
const server = http.createServer(app)

server.listen(app.get('port'),"0.0.0.0",()=>{
    console.log(`Express server listening on http://localhost:${app.get('port')}`)
});
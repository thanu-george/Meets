import express from 'express';
import { createServer } from 'node:http';
import {connectToSocket} from './controllers/socketManager.js';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

import userRoutes from './routes/user.routes.js';

const app=express();
const server=createServer(app); 
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({extended:true,limit:"40kb"}));

app.use('/api/v1/users', userRoutes);

app.get('/',(req,res)=>{
    return res.json({"hello":"world"});
})

const start = async () => {
    const connectionDb = await mongoose.connect(process.env.MONGO_URI);

    console.log(`Database connected successfully: ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
        console.log("Server is running on port 8000");
    });
}

start();
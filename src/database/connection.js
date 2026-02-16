import mongoose from "mongoose";
import { mongoURI } from "../../config/index.js";

export const databaseConnection = async ()=> { 
    await mongoose.connect(mongoURI).then(()=>{
        console.log('database connected successfully');
    }).catch((err)=>{
        console.error('cant connect to database: ', err)
    })
}
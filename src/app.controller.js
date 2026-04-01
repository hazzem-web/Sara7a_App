import express from 'express';
import { databaseConnection, redisConnect } from './database/index.js';
import { BASE_URL, Port } from '../config/index.js';
import { globalErrorHandler } from './common/utils/responses/index.js';
import path from 'path';
import cors from 'cors';
import authRouter from './modules/auth/auth.controller.js';
import userRouter from './modules/users/user.controller.js';
import messageRouter from './modules/messages/message.controller.js';
import './cron.js';
import helmet from 'helmet';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import axios from 'axios';
const allowedOrigins = [BASE_URL];
export const bootstrap = async ()=>{
    const app = express();
    app.set("trust proxy", true);

    let getCountryCode = async (ip)=>{
        let data = await axios.get(`http://ip-api.com/json/${ip}`);
        return data.data.countryCode;
    }

    app.use(rateLimit({
        windowMs: 15 * 1000 * 60,
        limit: async(req,res)=>{
            let countryCode = await getCountryCode(req.ip);
            console.log(countryCode, " limit")
            console.log(ipKeyGenerator(req.ip));
            return countryCode === "EG" ? 3 : 0;
        }
    }))

    const uploadsPath = path.join(process.cwd(), 'uploads');
    console.log("serving static files from: ", uploadsPath);
    app.use(express.static(uploadsPath));
    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}))
    app.use(helmet());
    app.use(cors({
        origin: function(origin, callback){
            if (!origin || allowedOrigins.includes(origin)) { 
                return callback(null , true)
            }
            return callback(new Error("this origin is not allowed to send request (unauthorized)"))
        },
        credentials: true   
    }));

    app.use('/uploads',express.static('uploads'))
    app.use('/auth', authRouter);
    app.use('/users',userRouter);   
    app.use('/messages',messageRouter);
    await redisConnect();
    await databaseConnection();
    app.use('{*dummy}', (req,res)=> res.status(404).json('Page Not Found'));
    app.use(globalErrorHandler);

    app.listen(Port, ()=> console.log(`server is running on port ${Port}`));
}

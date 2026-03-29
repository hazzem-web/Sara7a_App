import express from 'express';
import { databaseConnection, redisConnect } from './database/index.js';
import { BASE_URL, Port } from '../config/index.js';
import { globalErrorHandler } from './common/utils/responses/index.js';
import cors from 'cors';
import authRouter from './modules/auth/auth.controller.js';
import userRouter from './modules/users/user.controller.js';
import messageRouter from './modules/messages/message.controller.js';
import './cron.js';
const allowedOrigins = [BASE_URL    ];
export const bootstrap = async ()=>{
    const app = express();
    app.use(express.json());
    app.use(cors({
        origin: [...allowedOrigins],
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

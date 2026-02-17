import express from 'express';
import { databaseConnection } from './database/index.js';
import { Port } from '../config/index.js';
import { globalErrorHandler } from './common/utils/responses/index.js';
import authRouter from './modules/auth/auth.controller.js';

export const bootstrap = async ()=>{
    const app = express();
    app.use(express.json());
    app.use('/auth', authRouter);
    await databaseConnection();
    app.use('{*dummy}', (req,res)=> res.status(404).json('Page Not Found'));
    app.use(globalErrorHandler);

    app.listen(Port, ()=> console.log(`server is running on port ${Port}`));
}
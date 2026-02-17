import { Router } from "express";
import { login, signup } from "./auth.service.js";
import { SuccessResponse } from '../../common/utils/responses/index.js';


const router = Router();

router.post('/signup', async (req,res)=>{
    let addedUser = await signup(req.body);
    return SuccessResponse({res , message: "user added successfully" , status:201 , data: addedUser})
})


router.post('/login', async (req,res)=>{
    let userData = await login(req.body);
    return SuccessResponse({res , message: "user login successfully" , status:200 , data: userData})
})


export default router;
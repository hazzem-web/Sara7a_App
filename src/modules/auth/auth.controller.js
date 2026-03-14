import { Router } from "express";
import { generateAccessToken, login, signup, signupGoogle } from "./auth.service.js";
import { SuccessResponse } from '../../common/utils/responses/index.js';
import { extensions, upload, valiadtion } from "../../common/middleware/index.js";
import { loginSchema, signupSchema } from "./auth.validation.js";



const router = Router();



router.post('/signup', upload({customPath: 'image/users/profileImages' , allowedExtensions: extensions.image}).single('image') , valiadtion(signupSchema) , async (req,res)=>{
    let addedUser = await signup(req.body , req.file);
    return SuccessResponse({res , message: "user signed up successfully" , status:201 , data: addedUser})
})


router.post('/login', valiadtion(loginSchema) , async (req,res)=>{
    let userData = await login(req.body , `${req.protocol}://${req.host}`);
    return SuccessResponse({res , message: "user login successfully" , status:200 , data: userData})
})

router.get('/generate-access-token', async(req,res)=>{
    let { authorization } = req.headers;
    let accessToken = await generateAccessToken(authorization);

    return SuccessResponse({res , message: "access token created successfully" , status: 201, data: accessToken})
})



router.post('/signup/gmail', async(req,res)=>{
    let data = await signupGoogle(req.body);
    return SuccessResponse({res , message: "user signed up successfully" , status: 201 , data})
})



router.post('/forget-password', async(req,res)=>{
    let data = await forgetPassword(req.body);
    return SuccessResponse({res, message: "otp sent", status: 200 , data});
})


router.post('/reset-password', async(req,res)=>{
    let data = await resetPassword(req.body);
    return SuccessResponse({res, message: 'password reset successfully', status: 200, data}) 
})


export default router;















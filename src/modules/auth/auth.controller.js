import { Router } from "express";
import { generateAccessToken, login, logout, signup, signupGoogle, toogleTwoStepVerification, verifyEmail } from "./auth.service.js";
import { SuccessResponse } from '../../common/utils/responses/index.js';
import { auth, extensions, upload, valiadtion } from "../../common/middleware/index.js";
import { loginSchema, signupSchema } from "./auth.validation.js";



const router = Router();



router.post('/signup', upload({customPath: 'image/users/profileImages' , allowedExtensions: extensions.image}).single('image') , valiadtion(signupSchema) , async (req,res)=>{
    let addedUser = await signup(req.body , req.file);
    return SuccessResponse({res , message: "user signed up successfully" , status:201 , data: addedUser})
})


router.post('/toogle-2-step-verification', auth , async(req,res)=>{
    let data = await toogleTwoStepVerification(req.userId);
    return SuccessResponse({res , message: 'Email Sent Successfully' , status: 200 , data});
})

router.post('/verify' , async(req,res)=>{ 
    let data = await verifyEmail(req.body);
    return SuccessResponse({res, message: "email verified successfully", status: 200, data})
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


router.post('/logout' , auth , async(req,res)=>{
    let user = await logout(req);
    return SuccessResponse({res, message: 'User Logged Out Successsfully', status: 200});
})


export default router;















import { Router } from "express";
import { forgetPassword, generateAccessToken, login, logout, resetPassword, signup, signupGoogle, toggleTwoStepVerification, twoStepLoginVerify, verifyEmail, verifyTwoStep } from "./auth.service.js";
import { SuccessResponse } from '../../common/utils/responses/index.js';
import { auth, extensions, upload, valiadtion } from "../../common/middleware/index.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

const router = Router();

router.post('/signup', upload({customPath: 'image/users/profileImages' , allowedExtensions: extensions.image}).single('image') , valiadtion(signupSchema) , async (req,res)=>{
    let addedUser = await signup(req.body , req.file);
    return SuccessResponse({res , message: "user signed up successfully" , status:201 , data: addedUser})
})


router.post('/toggle-2-step-verification', auth , async(req,res)=>{
    let data = await toggleTwoStepVerification(req.userId);
    return SuccessResponse({res , message: 'Email Sent Successfully' , status: 200 , data});
})

router.post('/verify-two-step', auth, async(req,res)=>{
    let data = await verifyTwoStep(req.userId,req.body);
    return SuccessResponse({res, message: 'User Two Step Verifaction Verified Successfully', status: 200, data});
})

router.post('/verify-email' , async(req,res)=>{ 
    let data = await verifyEmail(req.body);
    return SuccessResponse({res, message: "email verified successfully", status: 200, data})
})

router.post('/login', valiadtion(loginSchema) , async (req,res)=>{
    let userData = await login(req.body , `${req.protocol}://${req.host}`);
    if (!userData.twoStepVerification) { 
        return SuccessResponse({res , message: "user login successfully" , status:200 , data: userData})
    }
    else { 
        return SuccessResponse({res , message: "please enter the OTP Sent to your email to login using 2FA", status: 200, data: userData})
    }
    
})

router.post('/login/verify-two-step-login' , async(req,res)=>{
    let data = await twoStepLoginVerify(req.body , `${req.protocol}://${req.host}`);
    return SuccessResponse({res, message: 'user two step verification logged-in successfully', status: 200, data});
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


router.post('/forget-password', async(req,res)=>{
    let data = await forgetPassword(req.body);
    return SuccessResponse({res, message: 'Email Confirmation With OTP Sent to Reset Your Password', status: 200 , data});
})


router.put('/reset-password', async(req,res)=>{
    let data = await resetPassword(req.body);
    return SuccessResponse({res, message: 'Password Reset Successfully , Login With Your New Password', status: 200 , data});
})

export default router;















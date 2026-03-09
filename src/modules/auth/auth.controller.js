import { Router } from "express";
import { generateAccessToken, login, signup, signupGoogle } from "./auth.service.js";
import { SuccessResponse } from '../../common/utils/responses/index.js';
import { extensions, multer_local, valiadtion } from "../../common/middleware/index.js";
import { fileSchema, loginSchema, signupSchema } from "./auth.validation.js";



const router = Router();


router.post('/profile-image', multer_local({customPath: "image/users/profileImages"}).single('image'),(req,res)=>{
    let fileData = req.file
    fileData.finalPath = `${fileData.destination}/${fileData.filename}`
    res.status(200).json({
        msg:"done",
        file: req.file,
        body: req.body
    })
    // return SuccessResponse({res , message: "profile updated successfully" , status: 201})
})


router.post('/cover-images', multer_local({customPath: "images/user/covers"}).array('images') , (req,res)=>{
    let files = req.files;
    let body = req.body;
    files.map((file)=>{
        file.finalPath = `${file.destination}/${file.filename}`;
    }) 
    // res.status(200).json({
    //     msg: "done",
    //     files,
    //     body: req.body
    // })

   return SuccessResponse({res,message: "files uploaded successfully",status: 201 , data: {files , body}})
})


router.post('/fields', multer_local({customPath: 'images/user/fields'}).fields([
    {name: "cover", maxCount: 1},
    {name: "profile", maxCount: 2},
    {name: "cv", maxCount: 1}
]), (req,res)=>{
    let files = req.files;
    files.cover.map((file)=>{
        file.finalPath = file.destination + '/' + file.filename
    })
    files.profile.map((file)=>{
        file.finalPath = file.destination + '/' + file.filename
    })
    files.cv.map((file)=>{
        file.finalPath = file.destination + '/' + file.filename
    })
    res.status(200).json({
        msg: "done",
        files: req.files,
        body: req.body
    })
})


router.post('/none', multer_local({customPath: 'images/user/none'}).none(), async(req,res)=>{
    res.status(200).json({
        msg: "done",
        file: req.files,
        body: req.body
    }) 
})


router.post('/any', multer_local({customPath: 'images/user/any'}).any(), (req,res)=>{
    res.status(200).json({
        msg: 'done',
        files: req.files,
        body: req.body
    })
})



router.post('/single', multer_local({customPath: 'image/filtered' , allowedExtensions: [...extensions.image,...extensions.video,...extensions.pdf]}).single('image') , valiadtion(fileSchema) , (req,res)=>{
    let file = req.file;
    file.finalPath = file.destination + '/' + file.filename;
    res.status(200).json({
        msg: "done",
        file: req.file,
        body: req.body
    })
})


router.post('/signup', valiadtion(signupSchema) , async (req,res)=>{
    let addedUser = await signup(req.body);
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




export default router;















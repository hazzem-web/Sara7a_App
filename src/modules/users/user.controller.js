import { Router } from "express"
import { getUserById } from "./user.service.js";
import { SuccessResponse } from "../../common/utils/responses/index.js";
import { auth } from "../../common/middleware/index.js";
const router = Router();

router.get('/get-user-by-id', auth , async(req,res)=>{
    let userData = await getUserById(req.userId);
    SuccessResponse({res,message: "user fetched successfully" , status:200 , data:userData});
})


export default router;
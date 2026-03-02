import { NOTE_SAFE_PROJECTION, USER_SAFE_PROJECTION } from "../../common/utils/projections.js";
import { NotFoundException } from "../../common/utils/responses/index.js";
import { findById, userModel } from "../../database/index.js";



export const getUserById = async(userId)=>{
    let userData = await findById({
        model:userModel , 
        id:userId,
        select: `${USER_SAFE_PROJECTION} ${NOTE_SAFE_PROJECTION}`
    });
    if (!userData) { 
        NotFoundException({message: "user not found"});
    }
    userData.viewsCount += 1;
    await userData.save();
    return {userData};
}
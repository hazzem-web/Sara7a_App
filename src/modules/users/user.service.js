import { NotFoundException } from "../../common/utils/responses/index.js";
import { findById, userModel } from "../../database/index.js";



export const getUserById = async(userId)=>{
    let userData = await findById({model:userModel , id:userId});
    if (!userData) { 
        NotFoundException({message: "user not found"});
    }
    return {userData};
}
import { NOTE_SAFE_PROJECTION, ProviderEnums, USER_SAFE_PROJECTION } from "../../common/index.js";
import { ConflictException, ErrorResponse, NotFoundException } from "../../common/utils/responses/index.js";
import { findOne, userModel } from "../../database/index.js";



const signup = async(data)=>{
    let { userName , email , password } = data;
    let existUser = await userModel.findOne({email});
    if (existUser) { 
        return ConflictException({message: 'user already exists'});
    }
    let addedUser = await userModel.insertOne({userName , email , password});
    if (!addedUser) { 
        return ErrorResponse();
    }
    return addedUser;
}



const login = async(data)=>{
    let {email , password } = data;
    let userData = await findOne({
        model: userModel , 
        filter: {email , password , provider: ProviderEnums.System},
        select: `${USER_SAFE_PROJECTION} ${NOTE_SAFE_PROJECTION}`
    });
    if (!userData) { 
        return NotFoundException({message: 'user not found'});
    }
    return userData;
}








export {
    signup,
    login
}
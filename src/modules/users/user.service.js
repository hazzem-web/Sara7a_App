import { BASE_URL } from "../../../config/env.service.js";
import { NOTE_SAFE_PROJECTION, USER_SAFE_PROJECTION } from "../../common/utils/projections.js";
import { NotFoundException } from "../../common/utils/responses/index.js";
import { findById, findByIdAndDelete, findByIdAndUpdate, findOne, userModel } from "../../database/index.js";
import fs from 'node:fs';


export const increaseUserViewCount = async (userData)=>{
    userData.viewsCount += 1;
    await userData.save();
}

export const userNotFound = ()=>{
    throw NotFoundException({message: 'user not found'});
}; 



export const getUserById = async(userId)=>{
    let userData = await findById({
        model:userModel , 
        id:userId,
        select: `${USER_SAFE_PROJECTION} ${NOTE_SAFE_PROJECTION}`
    });
    if (!userData) { 
        userNotFound();
    }
    await increaseUserViewCount(userData);
    return {userData};
}





export const getUserProfile = async(userId)=>{
    let userData = await findById({
        model: userModel,
        id: userId,
        select: 'firstName lastName email shareProfileName image viewsCount'
    });
    
    if (!userData) { 
        userNotFound();
    }
    await increaseUserViewCount(userData);
    return {userData};
};


export const shareProfileLink = async (userId)=>{
    let userData = await findById({
        model: userModel,
        id: userId
    });
    if (!userData) { 
        userNotFound();
    }
    let profileURL = `${BASE_URL}/${userData.shareProfileName}`;
    return {profileURL};
}


export const getUserDataByLink = async(data)=>{
    let { shareProfileLink } = data;
    let profileName = shareProfileLink.split("/")[3];
    let userData = await findOne({
        model: userModel,
        filter: {shareProfileName: profileName},
        select: "firstName lastName email viewsCount"
    });
    if (!userData) { 
        userNotFound();
    }
    await increaseUserViewCount(userData);
    return {userData};
}


export const updateUser = async(userId , data , file)=>{
    let { firstName , lastName , gender , phone , email , age } =  data;
    let updatedData = {};

    firstName ? updatedData.firstName = firstName : null 
    lastName ? updatedData.lastName = lastName : null 
    gender ? updatedData.gender = gender : null 
    phone ? updatedData.phone = phone : null 
    email ? updatedData.email = email : null 
    age ? updatedData.age = age : null
    
    if (file){
        userData.image = `${BASE_URL}/${file.destination}/${file.filename}`;
    }

    let user = await findByIdAndUpdate({
        model: userModel,
        id: userId,
        update: updatedData,
        options: {returnDocument: 'after'}
    })
    if (!user) { 
        userNotFound();
    }
    return {user};
}


export const deleteUser = async(userId)=>{
    let deletedUser = await findByIdAndDelete({
        model: userModel,
        id: userId,
        options: {returnDocument: 'after'}
    })
    if (!deletedUser) { 
        NotFoundException({message: 'user not found'})
    }
    return {deletedUser}
}
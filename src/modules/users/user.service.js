import { BASE_URL } from "../../../config/env.service.js";
import { NOTE_SAFE_PROJECTION, USER_SAFE_PROJECTION } from "../../common/utils/projections.js";
import { NotFoundException } from "../../common/utils/responses/index.js";
import { findById, findByIdAndDelete, findByIdAndUpdate, findOne, userModel } from "../../database/index.js";
import { get, redisDelete, set } from "../../database/redis.service.js";

const genProfileKey = (userId)=>{
    return `userProfile::${userId}`;
}

export const userNotFound = ()=>{
    throw NotFoundException({message: 'user not found'});
}; 

export const getUser = async(userId)=>{
    let user = await findById({
        model: userModel,
        id: userId
    })

    if (!user) { 
        userNotFound();
    }
    return {user};
}

let selectedUserData = "firstName lastName email shareProfileName image viewsCount";

export const increaseUserViewCount = async (userData) => {
    let updatedData = await findByIdAndUpdate({
        model: userModel,
        id: userData._id,
        update: {$inc: { viewsCount: 1 }},
        options: {returnDocument: 'after'},
        select: selectedUserData
    })
    return updatedData;
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
    let cachedUser = genProfileKey(userId);
    let userData = await get(cachedUser);
    if (userData) { 
        let updatedData = await increaseUserViewCount(userData);
        return {userData: updatedData};
    }    
    userData = await findById({
        model: userModel,
        id: userId,
        select: selectedUserData
    });
    if (!userData) { 
        userNotFound();
    }
    await set({
        key : cachedUser,
        value: userData,
        ttl : 60
    })
    await increaseUserViewCount(userData);
    return {userData};
};


export const shareProfileLink = async (userId)=>{
    let userData = await getUser(userId);
    let profileURL = `${BASE_URL}/${userData.shareProfileName}`;
    return {profileURL};
}


export const getUserDataByLink = async(data)=>{
    let { shareProfileLink } = data;
    let profileName = shareProfileLink.split("/")[3];
    let userData = await findOne({
        model: userModel,
        filter: {shareProfileName: profileName},
        select: selectedUserData
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
    if (user) { 
        await redisDelete(genProfileKey(userId));
        return {user};
    } 

    userNotFound();
    
}


export const deleteUser = async(userId)=>{
    let deletedUser = await findByIdAndDelete({
        model: userModel,
        id: userId,
        options: {returnDocument: 'after'}
    })
    if (!deletedUser) { 
        userNotFound();
    }
    return {deletedUser}
}



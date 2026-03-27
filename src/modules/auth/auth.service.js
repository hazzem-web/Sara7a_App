import { JwtAdminSignature, JwtUserSignature } from "../../../config/env.service.js";
import { compareHash, decodeRefreshToken, generateHash, generateToken, NOTE_SAFE_PROJECTION, ProviderEnums } from "../../common/index.js";
import { BadRequestException, ConflictException, ErrorResponse, NotFoundException, UnAuthorizedException } from "../../common/utils/responses/index.js";
import { findById, findByIdAndUpdate, findOne, findOneAndUpdate, insertOne, userModel } from "../../database/index.js";
import jwt from 'jsonwebtoken';
import {OAuth2Client} from 'google-auth-library';
import {BASE_URL} from '../../../config/env.service.js';
import { generateRevokeKey, get, increment, redisDelete, set, ttl } from "../../database/redis.service.js";
import { event } from "../../common/utils/email/email.events.js";
import { getUser, userNotFound } from "../users/user.service.js";


export const redisKey = (type, userOrId) => {
    const id = typeof userOrId === 'object' ? userOrId._id : userOrId;
    return `user::${type}::${id}`;
};


export const verifyOTP = async(identifier , code , cachedKey)=>{
    let key = redisKey(cachedKey,identifier);
    let cachedCode = await get(key);
    if (!cachedCode) { 
        throw UnAuthorizedException({message: 'OTP Is Expired'});
    }
    let compared = await compareHash(code , cachedCode);
    if (!compared) { 
        throw UnAuthorizedException({message: 'Invalid OTP'});
    }

    await redisDelete(key);
}


export const verifyOTPNoAuth = async(email,code )=>{
    let key = redisKey(cachedKey,userId);
    let cachedCode = await get(key);
    if (!cachedCode) { 
        throw UnAuthorizedException({message: 'OTP Is Expired'});
    }
    let compared = await compareHash(code , cachedCode);
    if (!compared) { 
        throw UnAuthorizedException({message: 'Invalid OTP'});
    }

    await redisDelete(key);
}


export const signup = async(data , file)=>{
    let { userName , email , password , age , shareProfileName , phone} = data;
    let existUser = await findOne({ 
        model: userModel , 
        filter:{email}
    });
    if (existUser) { 
        return ConflictException({message: 'user already exists'});
    }
    let image = '';

    if (file){
        image = `${BASE_URL}/${file.destination}/${file.filename}`;
    }
    // const salt = await bcrypt.genSalt( +Salt , "a")
    let hashedPassword = await generateHash(password);

    let addedUser = await insertOne({
        model:userModel,
        data: {userName , email , password:hashedPassword , age , shareProfileName , image , phone}
    })
    if (!addedUser) { 
        return ErrorResponse();
    }
    event.emit("verifyEmail",{userId: addedUser._id , email: addedUser.email , userName: addedUser.userName});
    return addedUser;
}





export const verifyEmail = async({code, email})=>{
    let user = await findOne({
        model: userModel,
        filter: {email}
    })
    if (!user) { 
        userNotFound();
    }

    if(user.isVerified == 1) { 
        throw BadRequestException({message: 'user is already verified'});
    }
    
    let redisCode = await get(redisKey("OTP",user));

    let compared = await compareHash(code, redisCode);
    if (!compared) { 
        throw UnAuthorizedException({message: 'Incorrect OTP'})
    }

    user = await findOneAndUpdate({
        model: userModel,
        filter: {_id: user._id},
        update: {isVerified: true},
        options: {returnDocument: 'after'}
    })


    if (!user) { 
        throw BadRequestException({message: 'unexpected error'});
    }
    event.emit("Confirmation", { email: user.email, userName: user.userName});
    return {user}
}


export const login = async(data,issuer)=>{
    let {email , password} = data;
    let userCacheKey = `user::${email}`;
    let bannedUserKey = `user::banned::${email}`
    let blockingTime = Math.ceil(await ttl(bannedUserKey) / 60)
    if (await get(bannedUserKey)) { 
        throw UnAuthorizedException({message: `User Is Banned Because Too many attempts try again within ${blockingTime} minutes`})
    }
    let userData = await findOne({
        model: userModel , 
        filter: {email , provider: ProviderEnums.System},
        select: `${NOTE_SAFE_PROJECTION}`
    }); 
    if (userData) { 
        if (!userData.isVerified) { 
            UnAuthorizedException({message: 'Your Account Is Not Vrified'});
        }
        const isMatched = await compareHash(password,userData.password); 
        if (isMatched) {   
            await redisDelete(userCacheKey);
            if (userData.twoStepVerification) { 
                event.emit("twoStepLogin", userData);
                return {message: 'email sent successfully'};
            }
            let { accessToken , refreshToken } = await generateToken(userData , issuer);
            return { userData, accessToken , refreshToken};
        }
        if (await get(userCacheKey)) { 
            await increment(userCacheKey);
            if (await get(userCacheKey) == 5){ 
                await set({
                    key: bannedUserKey,
                    value: "true",
                    ttl: 5 * 60
                })
                await redisDelete(userCacheKey);
            }
        } else { 
            await set ({
                key: userCacheKey,
                value: 1
            })
        }
        return NotFoundException({message: "incorrect password"})
    }

    return NotFoundException({message: 'user not found'});
}



export const twoStepLoginVerify = async({email,code} , issuer)=>{
    let user = await findOne({
        model: userModel,
        filter: {email}
    })
    if (!user) { 
        userNotFound();
    }
    await verifyOTP(email, code , "OTP::login")
    event.emit("twoStepLoginVerify",user);
    let { accessToken , refreshToken } = await generateToken(user , issuer);
    return { user , accessToken , refreshToken};
}


export const toggleTwoStepVerification = async(userId)=>{
    let user = await findById({
        model: userModel,
        id: userId
    });
    if (!user) { 
        userNotFound();
    }
    console.log(user);
    event.emit("toggle",user);


    return;
}


export const verifyTwoStep = async(userId , data)=>{
    let { code } = data;
    let user = await findById({
        model: userModel,
        id: userId
    })

    if (!user) { 
        userNotFound();
    }
    await verifyOTP(userId , code , "2SV");
    let updatedUser = await findByIdAndUpdate({
        model: userModel,
        id: userId,
        update: { twoStepVerification: !user.twoStepVerification},
        options: { returnDocument: 'after'}
    })

    event.emit("verifyTwoStep", updatedUser);
    return {updatedUser};
}


export const generateAccessToken = async (token)=>{
    let decodedData = decodeRefreshToken(token);
    let signature = undefined;
    switch (decodedData.aud) {
        case "Admin":
            signature = JwtAdminSignature;
            break;

        default:
            signature = JwtUserSignature;
            break;    
    }

    const accessToken = jwt.sign({id: decodedData.id}, signature, {
        expiresIn: '30m',
        audience: decodedData.aud
    })
    
    return accessToken;
}


export const signupGoogle = async(data)=>{
    let { idToken } = data;
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: WEB_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload.email_verified) { 
        throw BadRequestException('email not verified');
    }

    let existUser = await findOne({model: userModel, filter: {email: payload.email}});
    if (existUser) { 
        throw ConflictException("user already exists");
    }
    let addedUser = await insertOne({
        model: userModel,
        data:{
            userName: payload.name,
            email: payload.email
        }
    })

    if (!addedUser) {
        throw BadRequestException('something went wrong');  
    }

    return addedUser;
}


 
export const logout = async(req)=>{
    let {userId , decoded} = req;  
    let {jti} = decoded;
    const revokeToken = generateRevokeKey({userId,jti})
    await redisDelete(revokeToken);
}







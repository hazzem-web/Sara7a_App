import { JwtAdminSignature, JwtUserSignature } from "../../../config/env.service.js";
import { compareHash, decodeRefreshToken, generateHash, generateToken, NOTE_SAFE_PROJECTION, ProviderEnums } from "../../common/index.js";
import { BadRequestException, ConflictException, ErrorResponse, NotFoundException, UnAuthorizedException } from "../../common/utils/responses/index.js";
import { findOne, insertOne, userModel } from "../../database/index.js";
import jwt from 'jsonwebtoken';
import {OAuth2Client} from 'google-auth-library';
import {BASE_URL} from '../../../config/env.service.js';
import { generateRevokeKey, redisDelete } from "../../database/redis.service.js";
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
    return addedUser;
}



export const login = async(data,issuer)=>{
    let {email , password , twoStepVerification=false} = data;
    let userData = await findOne({
        model: userModel , 
        filter: {email , provider: ProviderEnums.System},
        select: `${NOTE_SAFE_PROJECTION}`
    });
    if (userData) { 
        if (userData.blockingTime && ( userData.blockingTime > Date.now() )) { 
            throw UnAuthorizedException({message: "Too many attempts try again within 5 minutes"})
        }
        const isMatched = await compareHash(password,userData.password); 
        if (isMatched) {   
            userData.twoStepVerification = twoStepVerification;
            if(twoStepVerification) { 
                console.log("hello")
            }
            let { accessToken , refreshToken } = await generateToken(userData , issuer);
            userData.attempts = 0;
            userData.blockingTime = null;
            await userData.save();
            return { userData, accessToken , refreshToken};
        }

        userData.attempts += 1;
        await userData.save();
        if (userData.attempts >= 5) { 
            userData.blockingTime = Date.now() + (60 * 5000);
            userData.attempts = 0;
            await userData.save();
            throw UnAuthorizedException({message: "many incorrect passwords please login later"})
        }
        return NotFoundException({message: "incorrect password"})
    }

    return NotFoundException({message: 'user not found'});
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




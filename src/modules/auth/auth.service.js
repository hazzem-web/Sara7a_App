import { JwtAdminSignature, JwtUserSignature } from "../../../config/env.service.js";
import { compareHash, decodeRefreshToken, generateHash, generateToken, NOTE_SAFE_PROJECTION, ProviderEnums } from "../../common/index.js";
import { BadRequestException, ConflictException, ErrorResponse, NotFoundException } from "../../common/utils/responses/index.js";
import { findOne, insertOne, userModel } from "../../database/index.js";
import jwt from 'jsonwebtoken';
import {OAuth2Client} from 'google-auth-library';



export const signup = async(data)=>{
    let { userName , email , password } = data;
    let existUser = await findOne({ 
        model: userModel , 
        filter:{email}
    });
    if (existUser) { 
        return ConflictException({message: 'user already exists'});
    }
    // const salt = await bcrypt.genSalt( +Salt , "a")
    let hashedPassword = await generateHash(password);

    let addedUser = await insertOne({
        model:userModel,
        data: {userName , email , password:hashedPassword}
    })
    if (!addedUser) { 
        return ErrorResponse();
    }
    return addedUser;
}



export const login = async(data,issuer)=>{
    let {email , password } = data;
    let userData = await findOne({
        model: userModel , 
        filter: {email , provider: ProviderEnums.System},
        select: `${NOTE_SAFE_PROJECTION}`
    });

    if (userData) { 
        let { accessToken , refreshToken } = generateToken(userData , issuer);
        const isMatched = await compareHash(password,userData.password); 
        if (isMatched) {   
            return { userData, accessToken , refreshToken};
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
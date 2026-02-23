import { Jwt_Key , JwtAdminSignature , JwtUserSignature } from "../../../config/index.js";
import { compareHash, generateHash, NOTE_SAFE_PROJECTION, ProviderEnums, USER_SAFE_PROJECTION } from "../../common/index.js";
import { ConflictException, ErrorResponse, NotFoundException } from "../../common/utils/responses/index.js";
import { findOne, userModel } from "../../database/index.js";
import jwt from 'jsonwebtoken';




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
    let addedUser = await userModel.insertOne({userName , email , password:hashedPassword});
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
        let signature = undefined;
        let audience = undefined;
        switch (userData.role) {
            case "0":
                signature = JwtAdminSignature;
                audience = "Admin"
                break;
        
            default:
                signature = JwtUserSignature;
                audience = "User"
                break;
        }

        const isMatched = await compareHash(password,userData.password); 
        if (isMatched) { 
            let token = jwt.sign({id: userData._id},signature,{
                expiresIn: "1d",
                notBefore: "30s",
                issuer,
                audience
            });
            return { userData, token};
        }
        NotFoundException({message: "incorrect password"})
    }

    return NotFoundException({message: 'user not found'});

    
}
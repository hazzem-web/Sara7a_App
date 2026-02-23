import jwt from 'jsonwebtoken';
import { UnAuthorizedException } from "../utils/responses/index.js";
import { JwtAdminSignature, JwtUserSignature } from '../../../config/index.js';



export const auth = (req,res,next)=>{
    let { authorization } = req.headers;
    if (!authorization) { 
        return UnAuthorizedException("UnAuthorized");
    }
    let decoded = jwt.decode(authorization)
    let signature = undefined;
    switch (decoded.aud) {
        case "Admin":
            signature = JwtAdminSignature;
            break;
    
        default:
            signature = JwtUserSignature;
            break;
    }
    let verified = jwt.verify(authorization,signature)
    req.userId = verified.id;
    next();
}
import { UnAuthorizedException } from "../utils/responses/index.js";
import { decodeToken } from '../security/security.js';
import { exists } from "../../database/redis.service.js";


export const auth = async(req,res,next)=>{
    let { authorization } = req.headers;
    if (!authorization) { 
        return UnAuthorizedException("UnAuthorized");
    }
    let [flag , token] = authorization.split(' ');
    switch (flag) {
        case "Basic":
            let data = Buffer.from(token, 'base64').toString();
            let [email , password] = data.split(':');
            console.log(email , " " , password);
            break;
        case "Bearer":
            let decodedData = decodeToken(token);
            const revokeToken = `revokeToken::${decodedData.id}::${decodedData.jti}`
            let exist = await exists(revokeToken);
            if(!exist) { 
                throw UnAuthorizedException({message: 'token revoked or expired'})
            }
            req.userId = decodedData.id;
            req.token = token;
            req.decoded = decodedData;
            next();
        default: 
            break;
    }
}
import { UnAuthorizedException } from "../utils/responses/index.js";
import { decodeToken } from '../security/security.js';


export const auth = (req,res,next)=>{
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
            req.userId = decodedData.id;
            next();
        default: 
            break;
    }
}
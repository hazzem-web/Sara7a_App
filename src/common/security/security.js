import jwt from 'jsonwebtoken';
import { JwtAdminRefreshSignature, JwtAdminSignature, JwtUserRefreshSignature, JwtUserSignature } from '../../../config/index.js';
import { UnAuthorizedException } from '../utils/responses/index.js';
export const  generateToken = (user , issuer) => {
  let signature = undefined;
  let audience = undefined;
  let refreshSignature = undefined;
  switch (user.role) {
    case "0":
      signature = JwtAdminSignature;
      refreshSignature = JwtAdminRefreshSignature
      audience = "Admin";
      break;

    default:
      signature = JwtUserSignature;
      refreshSignature = JwtUserRefreshSignature
      audience = "User";
      break;
  }

  let accessToken = jwt.sign({ id: user._id }, signature, {
    expiresIn: "30m",
    notBefore: "30s",
    issuer,
    audience,
  });

    let refreshToken = jwt.sign({ id: user._id }, refreshSignature, {
    expiresIn: "1y",
    notBefore: "30s",
    issuer,
    audience,
  });
  

  return { accessToken , refreshToken};
};



export const decodeToken = (token)=>{
  let decoded = jwt.decode(token);
    if (!decoded) { 
      return UnAuthorizedException();
    }
    let signature = undefined;
    switch (decoded.aud) {
        case "Admin":
            signature = JwtAdminSignature; 
            break;
    
        default:
            signature = JwtUserSignature;
            break;  
    }
    let verified = jwt.verify(token,signature)
    return verified;
}


export const  decodeRefreshToken = (token)=>{
  let decoded = jwt.decode(token);
    if (!decoded) { 
      return UnAuthorizedException();
    }
    let refreshSiganture = undefined;
    switch (decoded.aud) {
        case "Admin":
            refreshSiganture = JwtAdminRefreshSignature;
            break;
    
        default:
            refreshSiganture = JwtUserRefreshSignature;
            break;  
    }
    let verified = jwt.verify(token,refreshSiganture)
    return verified;
}

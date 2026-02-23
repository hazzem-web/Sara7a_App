import { compare, hash } from "bcrypt";
import { Salt } from "../../../config/env.service.js";

Salt
export const generateHash = async(plainText)=>{
    let encryptedPassword = await hash(plainText , +Salt);
    return encryptedPassword;
}



export const compareHash = async(plainText , hash)=>{
    const isMatched = await compare(plainText , hash);
    return isMatched;
}
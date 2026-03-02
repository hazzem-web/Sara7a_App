import { Types } from "mongoose";
import { BadRequestException } from "../utils/responses/index.js";

export const verifyID = (id)=> { 
    if (!Types.ObjectId.isValid(id)) {
        throw BadRequestException({message: "Invalid ID"})
    }
    return id;
}
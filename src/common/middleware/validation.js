import { BadRequestException } from "../utils/responses/index.js";
export const valiadtion = (schema)=>{
    return (req,res,next)=>{
        let { value , error} = schema.validate(req.body , { abortEarly: false });
        if (error) { 
            throw BadRequestException({message: 'validation error' , extra: error});
        }
        next();
    }
}

 
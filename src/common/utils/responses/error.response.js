import { envMood } from "../../../../config/env.service.js";

export const ErrorResponse = ({status = 400, message = "something went wrong", extra = undefined} = {})=>{
    throw new Error(message , {cause: { status, extra } });
}


export const BadRequestException = ({ message = "BadRequestException" , extra = undefined} = {})=>{
    return ErrorResponse({
        status:400,
        message,
        extra
    })
}



export const NotFoundException = ({ message = "NotFoundException" , extra = undefined} = {})=>{
    return ErrorResponse({
        status:404,
        message,
        extra
    })
}



export const ConflictException = ({ message = "ConflictException", extra = undefined } = {})=>{
    return ErrorResponse({
        status:409,
        message,
        extra
    })
}





export const UnAuthorizedException = ({ message = "UnAuthorizedException", extra = undefined } = {})=>{
    return ErrorResponse({
        status:401,
        message,
        extra
    })
}






export const ForbiddenException = ({ message = "ForbiddenException", extra = undefined } = {})=>{
    return ErrorResponse({
        status:409,
        message,
        extra
    })
}





export const globalErrorHandler = (err,req,res,next)=>{
    const status = err.status ? err.status : err.cause ? err.cause.status : 500
    const mood = envMood == 'dev';
    const defaultMessage = "something went wrong";
    const displayErrorMessage = err.message || defaultMessage;
    const extra = err.extra || {};
    
    res.status(status).json({
        status,
        stack: mood ? err.stack : null,
        errorMessage: mood ? displayErrorMessage : defaultMessage,
        extra
    })
}
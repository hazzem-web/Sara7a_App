import { NOTE_SAFE_PROJECTION, USER_SAFE_PROJECTION } from "../../common/utils/projections.js";
import { BadRequestException, NotFoundException, UnAuthorizedException } from "../../common/utils/responses/index.js";
import { deleteOne, findAll, findById, findByIdAndDelete, findOne, insertOne, userModel } from "../../database/index.js";
import { messageModel } from "../../database/models/message.model.js";

export const sendMessage = async(params,data)=>{
    let { recieverID } = params;
    let { message , image} = data;

    let existReciever = await findById({
        model: userModel,
        id: recieverID,
        select: `${USER_SAFE_PROJECTION} ${NOTE_SAFE_PROJECTION}`
    })

    if (!existReciever) { 
        throw NotFoundException("user not found");
    }

    let addedMessage = await insertOne({
        model: messageModel ,
        data: {message , image , recieverID }
    })

    if (addedMessage) { 
        return addedMessage;
    } else { 
        return NotFoundException("message not sent")
    }
}



export const getAllMessages = async(userId)=>{
    let existUser = await findById({
        model: userModel,
        id: userId
    })
    if (!existUser) { 
        throw NotFoundException("user not found");
    }

    let messages = await findAll({
        model: messageModel,
        filter: {recieverID: userId},
        select: `${NOTE_SAFE_PROJECTION}`
    })

    if (!messages.length) { 
        throw NotFoundException('no message found')
    }

    return {messages}
}



export const getMessageById = async (userId , id)=>{
    let message = await findOne({
        model: messageModel,
        filter: {_id:id , recieverID: userId},
        select: `${NOTE_SAFE_PROJECTION}`
    })
    if (!message) { 
        throw NotFoundException("message not found");
    }

    return {message};
}


export const deleteMessage = async (userId , id)=> {
    let deletedMessage = await deleteOne({
        model: messageModel,
        filter: {_id:id , recieverID: userId}
    });
    if (!deletedMessage.deletedCount) { 
        throw NotFoundException("message not found");
    }
}
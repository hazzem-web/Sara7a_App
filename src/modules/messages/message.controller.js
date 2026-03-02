import Router from 'express';
import { deleteMessage, getAllMessages, getMessageById, sendMessage } from './message.service.js';
import { SuccessResponse } from '../../common/utils/responses/index.js';
import { auth, valiadtion } from '../../common/middleware/index.js';
import { sendMessageSchmea } from './message.validation.js';

const router = Router(); 

router.post('/send-message/:recieverID' , valiadtion(sendMessageSchmea) , async (req,res)=>{
    let message = await sendMessage(req.params , req.body);
    SuccessResponse({res , message: "message added successfully" , status: 201 , data: message});
})


router.get('/get-all-messages' , auth , async(req,res)=>{
    let messages = await getAllMessages(req.userId);
    SuccessResponse({res , message: "messages fetched successfully" , status: 200 , data: messages});
})

router.get('/get-message-by-id/:id', auth ,async(req,res)=>{
    let message = await getMessageById( req.userId , req.params.id);
    SuccessResponse({res , message: "message fetched successfully" , status: 200 , data: message});
})


router.delete('/delete-message/:id' , auth , async(req,res)=>{
    let deletedNessage = await deleteMessage(req.userId , req.params.id);
    SuccessResponse({res , message: "message deleted successfully" , status: 200 , data: deletedNessage});
})

export default router;2
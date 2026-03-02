import mongoose , { Types } from "mongoose"

const messageSchema = new mongoose.Schema({
    message: { 
        type: String,
        required: true,
        min: 10,
        max: 500
    },
    recieverID: { 
        type: Types.ObjectId,
        ref: 'users',
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    },
    image: {  
        type: String
    }
},{
    timestamps: true
})


export const messageModel = new mongoose.model('Messages', messageSchema);
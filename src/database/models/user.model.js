import mongoose from "mongoose";
import { GenderEnums, ProviderEnums, RoleEnums } from "../../common/index.js";
import { type } from "node:os";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    }, lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    DOB: String,
    gender: { 
        type: String,
        enum: Object.values(GenderEnums),
        default: GenderEnums.Male
    },
    provider: { 
        type: String,
        enum: Object.values(ProviderEnums),
        default: ProviderEnums.System
    },
    role:{
        type: String,
        enum: Object.values(RoleEnums),
        default: RoleEnums.User
    },
    viewsCount:{
        type: Number,
        default: 0
    },
    attempts: {
        type: Number, 
        default: 0
    },
    blockingTime: { 
        type: Date,
        default: null
    },
    twoStepVerification: { 
        type: Boolean,
        default: false
    }
},{
    timestamps:true
})


userSchema.virtual('userName').set(function (value) { // hazzem mohammed => ['hazzem, 'mohammed']
    let [firstName , lastName] = value.split(' ');
    this.firstName = firstName; 
    this.lastName = lastName;
}).get(function(){
    return `${this.firstName} ${this.lastName}`;
})


export const userModel = mongoose.model('users', userSchema);
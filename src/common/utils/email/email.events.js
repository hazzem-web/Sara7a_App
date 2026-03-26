import { EventEmitter } from "events";
import { generateHash } from "../../hashing/hash.js";
import { redisKey } from "../../../modules/auth/auth.service.js";
import { set } from "../../../database/redis.service.js";
import { sendEmail } from "./sendEmail.js";

export let event = new EventEmitter();

export function createOTP(){
    let code = Math.floor(Math.random() * 1000000)
    code = code.toString().padStart(6,"0"); 
    return code;
} 

event.on("verifyEmail", async(data)=>{
    let {userId , email , userName} = data;              
    let code = createOTP();
    await set({
        key: redisKey("OTP",userId),
        value: await generateHash(code),
        ttl: 5 * 60 // 5 minutes
    })
    await sendEmail({
        to: email,
        subject: "user registerd successfully please verify your email" ,
        html: `<h1>Hello: ${userName}</h1>
            <p> your otp is: ${code} </p>
            <p>Note: this otp is valid for 5 minutes</p>
        `
    });
})


event.on("Confirmation", async({email , userName})=>{
    await sendEmail({
        to: email,
        subject: "email verified successfully",
        html: `<h1>Hello: ${userName}</h1>
            <p>your acoount is verified via otp</p>`
    })  
})



event.on("toogle", async(user)=>{
    let code = createOTP();
    await set({
        key: redisKey("2SV",user._id),
        value: await generateHash(code),
        ttl: 5 * 60
    })
    await sendEmail({
        to: user.email,
        subject: user.twoStepVerification ? "Disable Two Step Verification" : "Enable Two Step Verification",
            html: `<h1>Hello: ${user.userName}</h1>
            <p> your otp is: ${code} </p>
            <p>Note: this otp is valid for 5 minutes</p>
        `
    })
})


event.on("verifyTwoStep", async(user)=>{
    let message = user.twoStepVerification ? " Two Step Verification Enabled Successfully" : " Two Step Verification Disabled Successfully";
    await sendEmail({
        to: user.email,
        subject: "twoStepVerification State",
        html: `<h1>Hello: ${user.userName}</h1>
        <p> ${message}</p>
     `
    })
})

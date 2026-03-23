import { EventEmitter } from "events";
import { generateHash } from "../../hashing/hash.js";
import { redisOtp } from "../../../modules/auth/auth.service.js";
import { set } from "../../../database/redis.service.js";
import { sendEmail } from "./sendEmail.js";

export let event = new EventEmitter();

event.on("verifyEmail", async(data)=>{
    let {userId , email , userName} = data;

    let code = Math.floor(Math.random() * 1000000)
    code = code.toString().padStart(6,0); 
    await set({
        key: redisOtp(userId),
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



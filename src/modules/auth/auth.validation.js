import joi from 'joi';
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*-+]).{8,}$/;
export const phonePattern = /^\+?[1-9]\d{1,14}$/


export const signupSchema = joi.object({
    userName: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi
            .string()
            .min(6)
            .max(50)
            .pattern(passwordRegex)
            .required(),
    gender: joi.string().optional(),        
    age: joi.number().min(18).max(50).required().messages({
        "number.min": "age must be at least 18",
        "number.max": "age must be at most 50"
    }),
    shareProfileName: joi.string().required(),
    image: joi.string().optional(),
    phone: joi.string().pattern(phonePattern).optional().messages({
        "validation error": "phone must be a valid phone number"
    })
}); 



export const loginSchema = joi.object({
    email: joi.string().min(3).max(50).required(),
    password: joi.string().min(6).max(50).required(),
})


export const fileSchema = joi.object({
    file: {
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().required(),
        finalPath: joi.string().required()
    },
    text: joi.string().optional()
})


export const verifyEmailSchema = joi.object({
    code: joi.string().length(6).required().messages({
        "string.length": "OTP length must be 6 numbers"
    }),
    email: joi.string().email().required()
});


export const twoStepLoginVerifySchema = joi.object({
    email: joi.string().email().required(),
    code: joi.string().length(6).required().messages({
        "string.length": "OTP length must be 6 numbers"
    })
})


export const verifyTwoStepSchema = joi.object({
    code: joi.string().length(6).required().messages({
        "string.length": "OTP length must be 6 numbers"
    })
})



export const forgetPasswordSchema = joi.object({
    email: joi.string().email().required()
})



export const resetPasswordSchema = joi.object({
    email: joi.string().email().required(),
    code: joi.string().length(6).required().messages({
            "string.length": "OTP length must be 6 numbers"
        }), 
    password: joi
            .string()
            .min(6)
            .max(50)
            .pattern(passwordRegex)
            .required(),
    confirmPassword: joi
            .string()
            .min(6)
            .max(50)
            .pattern(passwordRegex)
            .required() 
})

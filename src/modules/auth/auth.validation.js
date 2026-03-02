import joi from 'joi';

export const signupSchema = joi.object({
    userName: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi
            .string()
            .min(6)
            .max(50)
            .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*-+]).{8,}$/)
            .required(),
    gender: joi.string().optional(),        
    age: joi.number().min(18).max(50).optional().messages({
        "number.min": "age must be at least 18",
        "number.max": "age must be at most 50"
    }),
    users: joi.array().optional().items(
        joi.object({
            name: joi.string().min(3).max(50).required()
        })
    )
}); 



export const loginSchema = joi.object({
    email: joi.string().min(3).max(50).required(),
    password: joi.string().min(6).max(50).required()
})



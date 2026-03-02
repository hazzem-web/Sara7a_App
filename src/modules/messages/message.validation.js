import joi from "joi";

export const sendMessageSchmea = joi.object({
    message: joi.string().min(10).max(500).required().messages({
        "message.min": "message must be at least 10 characters",
        "message.max": "message must be at most 500 characters",
    }),
    image: joi.string().optional()
})


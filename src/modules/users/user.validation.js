import joi from 'joi';
import { phonePattern } from '../auth/auth.validation.js';
const linkRegex = /^https?:\/\/[^\/]+\/[a-zA-Z0-9_-]+$/

export const userLinkSchema = joi.object({
    shareProfileLink: joi.string().required().pattern(linkRegex)
})


export const updateUserSchema = joi.object({
    firstName: joi.string().optional(),
    lastName: joi.string().optional(),
    gender: joi.string().optional(),
    phone: joi.string().pattern(phonePattern).optional(), 
    email: joi.string().email().optional(), 
    age: joi.number().optional(),
    image: joi.string().optional()
})
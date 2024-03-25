import {z} from 'zod';

export const UserCreateSchema = z.object({
     name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(2).max(355),
   
})

export const UserLoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const AccessTokenSchema = z.object({
    token: z.string(),
})

export const EmailVerifySchema = z.object({
    email: z.string().email(),
    code: z.string(),
})
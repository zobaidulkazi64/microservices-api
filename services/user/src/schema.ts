import {z} from 'zod';

export const UserCreateSchema = z.object({
    authUserId: z.string(),
    name: z.string(),
    email: z.string().email(),
    address: z.string().optional(),
    phone: z.string().optional().default('9912345678'),
})

export const UserUpdateSchema = UserCreateSchema.omit({
    authUserId: true,
}, ).partial()
import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"
import prisma from "@/prisma"
import {AccessTokenSchema} from '@/schema'



const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate request body
        const parsedBody = AccessTokenSchema.safeParse(req.body);

        console.log(parsedBody)

        if(!parsedBody.success) {
            return res.status(400).json({
                success: false,
                message: parsedBody.error.errors
            })
        }
        // check if token is valid
        const accessToken = parsedBody.data;
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string);

        const user = await prisma.user.findUnique({
            where: {
                id: (decoded as any).userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true    
            }
        })

        if(!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid token'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Token verified',
            data: user
        })

    } catch (error) {
        console.log(error)
       return res.status(400).json({
           success: false,
           message: 'Invalid token'
       })

    }
}


export default verifyToken;
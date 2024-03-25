import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"
import axios from "axios"

import prisma from "@/prisma"
import {EmailVerifySchema} from '@/schema'


const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate request body
        const parsedBody = EmailVerifySchema.safeParse(req.body);
        if(!parsedBody.success) {
            return res.status(400).json({
                success: false,
                message: parsedBody.error.errors
            })
        }
        // check if user email is exist
        const user = await prisma.user.findUnique({
            where: {
                email: parsedBody.data.email
            }
        })
        if(!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            })
        }
        // find email verification code
        const emailVerification = await prisma.verificationCode.findFirst({
            where: {
                userId: user.id,
                code: parsedBody.data.code
            }
        })
        if(!emailVerification) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            })
        }

        // if code is expired
        if(emailVerification.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Verification code expired'
            })
        }

        // update user status to verified
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                verified: true,
                status: 'ACTIVE'
            }
        })

        // update verification code status to used
        await prisma.verificationCode.update({
            where: {
                id: emailVerification.id
            },
            data: {
                status: 'USED',
                verifiedAt: new Date()
            }
        })

        // send success email
        // send success email
        await axios.post('http://localhost:4000/api/email/send', {
            recipient: user.email,
            subject: 'Email verification successful',
            body: 'Email verification successful, you can now login',
            source: 'Email verification successful'
        })
        

        // send success response
        return res.status(200).json({
            success: true,
            message: 'Email verification successful'    
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            next: error
        })
    }
}

export default verifyEmail
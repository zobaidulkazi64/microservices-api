import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/prisma';
import {UserLoginSchema} from '../schema';
import {LoginAttemptStatus} from '@prisma/client'



type LoginHistory = {
    userId: string;
    userAgent: string | undefined;
    ipAddress: string | undefined;
    attempt: LoginAttemptStatus
}

const createLoginHistory = async (info: LoginHistory) => {
    await prisma.loginHistory.create({
        data: {
            userId: info.userId,
            userAgent: info.userAgent,
            ipAddress: info.ipAddress,
            attempt: info.attempt
        }
    })
}


const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // ip address
        const ipAddress = req.headers['x-forwarded-for'] as string || req.ip || '';
        const userAgent = req.headers['user-agent'] as string || '';


        // validate request body
        const parsedBody = UserLoginSchema.safeParse(req.body);
        if(!parsedBody.success) {
            return res.status(400).json({
                success: false,
                message: parsedBody.error.errors
            })
        }

        // check if user exists

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
        // check if password is correct
        const passwordIsCorrect = await bcrypt.compare(parsedBody.data.password, user.password)
        if(!passwordIsCorrect) {
            await createLoginHistory({
                userId: user.id,
                userAgent,
                ipAddress,
                attempt: LoginAttemptStatus.FAILED
            })
            return res.status(400).json({
                success: false,
                message: 'Incorrect password'
            })
        }

        // // check if user is verified

        // if(!user.verified) {
        //    await createLoginHistory({
        //        userId: user.id,
        //        userAgent,
        //        ipAddress,
        //        attempt: LoginAttemptStatus.FAILED
        //    })
        //    return res.status(400).json({
        //        success: false,
        //        message: 'Please verify your email'
        //    })
        // }

        // check if account is active
        // if(user.status !== 'ACTIVE') {
        //     await createLoginHistory({
        //         userId: user.id,
        //         userAgent,
        //         ipAddress,
        //         attempt: LoginAttemptStatus.FAILED
        //     })
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Your account is not active'
        //     })
        // }

        // generate access token

        const accessToken = jwt.sign({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }, process.env.ACCESS_TOKEN_SECRET as string ?? 'mysecretkey', {
            expiresIn: '1d'
        })

        // login history
        await createLoginHistory({
            userId: user.id,
            userAgent,
            ipAddress,
            attempt: LoginAttemptStatus.SUCCESS
        })

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

export default userLogin
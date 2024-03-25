import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import {UserCreateSchema} from '../schema';
import prisma from '@/prisma';




const generateVerificationCode = async () => {
    // get current time
    const timestamp = new Date().getTime().toString();

    // generate a  random 2 digit number
    const randomNumber = Math.floor(10 + Math.random() * 90);

    // concatenate timestamp and random number
    let code = (timestamp + randomNumber).slice(-5);

    return code


}



export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
   try {
    
     // validate request body
    const parsedBody = UserCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({
            success: false,
            message: parsedBody.error
        })
    }

    // check if email is already registered

    const existingUser = await prisma.user.findUnique({
        where: {
            email: parsedBody.data.email
        }
    })
    if(existingUser) {
        return res.status(400).json({
            success: false,
            message: 'Email already registered'
        })
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsedBody.data.password, salt);

    // create auth user
    const user = await prisma.user.create({
        data: {
            ...parsedBody.data,
            password: hashedPassword
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            status: true,
            verified: true
        }
    })

    console.log("User created: ",user)

    // create the user profile by calling the user service
    await axios.post('http://localhost:4000/api/users', {
        authUserId: user.id,
        name: user.name,
        email: user.email
    })

    // generate verification code
    const code = await generateVerificationCode();

    await prisma.verificationCode.create({
        data: {
            userId: user.id,
            code,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)  // 5 minutes
        }
    })

    // send verification email
    await axios.post('http://localhost:4000/api/emails/send', {
        recipient: user.email,
        subject: 'Email verification',
        body: `Your verification code is ${code}`,
        source: 'User Registration'
    })

    return res.status(200).json({
        success: true,
        message: 'User created successfully, verification email sent, check your inbox',
        data: user
    })

   } catch (error) {
    console.log(error)
    next(error)
   }

}


export default userRegistration
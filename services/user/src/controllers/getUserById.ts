import {Request, Response, NextFunction} from 'express'
import prisma from '@/prisma'
import {User} from '@prisma/client'



const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        const field = req.query.field as string
        // check if user exists
        let user : User | null = null

        if(field === 'authUserId') {
            user = await prisma.user.findUnique({
                where: {
                    authUserId: id

                    
                },
                
            })
        }else{
            user = await prisma.user.findUnique({
                where: {
                    id
                },
                
            })
        }
        // check if user exists
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        // return the user
        return res.status(200).json({
            success: true,
            data: user
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'

        })
    }
}


export default getUserById
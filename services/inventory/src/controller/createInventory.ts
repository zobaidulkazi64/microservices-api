import {Request, Response, NextFunction} from 'express'
import prisma from '../../prisma'



const createInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}
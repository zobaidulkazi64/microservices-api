import {Request, Response, NextFunction} from 'express'
import { InventoryCreateDTOSchema } from '../schema'
import prisma from '@/prisma'


const createInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
       // validation req body
       const parsedBody = InventoryCreateDTOSchema.safeParse(req.body)
       if(!parsedBody.success){
           return res.status(400).json({
               success: false,
               message: 'Invalid request body',
               error: parsedBody.error
           })
       }

       // create inventory
       const inventory = await prisma.inventory.create({
           data: {
               ...parsedBody.data,
               histories: {
                   create: {
                    actionType: "IN",
                    quantityChanged: parsedBody.data.quantity,
                    lastQuantity: parsedBody.data.quantity,
                    newQuantity: parsedBody.data.quantity
                   }
               }
           },
           select: {
               id: true,
               quantity: true
           }
       })

       return res.status(201).json({
           success: true,
           message: 'Inventory created successfully',
           data: inventory
       })
      
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export default createInventory
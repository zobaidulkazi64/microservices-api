import {Request, Response, NextFunction} from 'express'
import prisma from '@/prisma'
import { InventoryUpdateDTOSchema } from '../schema'


const updateInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // check if inventory exists
        const { id } = req.params
        const inventory = await prisma.inventory.findUnique({
            where: {
                id
            }
        })


        if(!inventory){
            return res.status(404).json({
                success: false,
                message: 'Inventory not found'
            })
        }

        // update inventory
        const parsedBody = InventoryUpdateDTOSchema.safeParse(req.body)

        if(!parsedBody.success){
            return res.status(400).json({
                success: false,
                message: 'Invalid request body',
                error: parsedBody.error
            })
        }

        // find latest history
        const latestHistory = await prisma.history.findFirst({
            where: {
                inventoryId: id
            },
            orderBy: {
                createdAt: 'desc'
            }
        })


        // calculate new quantity
        let newQuantity = inventory.quantity
        if(parsedBody.data.actionType === 'IN'){
            newQuantity += parsedBody.data.quantity
        }else if(parsedBody.data.actionType === 'OUT'){
            newQuantity -= parsedBody.data.quantity
        }else{
            return res.status(400).json({
                success: false,
                message: 'Invalid action type'
            })
        }

        // finally update inventory

        const updatedInventory = await prisma.inventory.update({
            where: {id},
            data: {
                quantity: newQuantity,
                histories: {
                    create: {
                        actionType: parsedBody.data.actionType,
                        quantityChanged: parsedBody.data.quantity,
                        lastQuantity: latestHistory?.newQuantity || 0,
                        newQuantity
                    }
                }
            },
            select: {
                id: true,
                quantity: true
            }
        })

        return res.status(200).json({
            success: true,
            data: updatedInventory
        })




    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Server error'})
    }
}



export default updateInventory
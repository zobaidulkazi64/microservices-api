import express from 'express';
const router = express.Router();
import {createInventory, getInventoryById, getInventoryDetails, updateInventory} from '../controllers'


router.post('/create', createInventory);

// get inventory by id
router.get('/inventory/:id', getInventoryById);

// get inventory details
router.get('/inventory/:id/details', getInventoryDetails);

// update inventory
router.put('/inventory/:id', updateInventory);
export default router
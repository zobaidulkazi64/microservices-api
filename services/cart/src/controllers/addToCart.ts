import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { CART_TTL, INVENTORY_SERVICE } from "../../config";
import { CartItemSchema } from "../../schemas";

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate request body
    const parsedBody = CartItemSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: parsedBody.error.message,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default addToCart;

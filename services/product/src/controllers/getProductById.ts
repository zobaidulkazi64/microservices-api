import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Get a product by ID
const getProductById = router.get(
  "/products/:id",
  async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error retrieving product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default getProductById;

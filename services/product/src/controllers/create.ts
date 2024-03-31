import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

interface ProductInput {
  name: string;
  price: number;
  description: string;
}

// Create a new product
router.post("/products", async (req: Request, res: Response) => {
  const { name, price, description }: ProductInput = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

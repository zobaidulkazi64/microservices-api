import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

interface ProductInput {
  name: string;
  price: number;
  description: string;
}

// Update a product by ID
router.put("/products/:id", async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  const { name, price, description }: ProductInput = req.body;
  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: name || existingProduct.name,
        price: price || existingProduct.price,
        description: description || existingProduct.description,
      },
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

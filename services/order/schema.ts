import z from "zod";

export const OrderCreateSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  userEmail: z.string(),
  cartSessionId: z.string(),
});

export const CreateItemSchema = z.object({
  productId: z.string(),
  inventoryId: z.string(),
  quantity: z.number(),
});

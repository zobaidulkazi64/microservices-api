import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

export const CART_SERVICE_URL =
  process.env.CART_SERVICE_URL || "http://localhost:4006";
export const EMAIL_SERVICE_URL =
  process.env.EMAIL_SERVICE_URL || "http://localhost:4007";
export const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:4005";
export const QUEUE_NAME = process.env.QUEUE_NAME || "order";

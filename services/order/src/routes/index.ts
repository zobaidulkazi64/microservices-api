import { Router } from "express";
const router = Router();
import { createProducts } from "../controllers/index";

router.post("/", createProducts);

export default router;

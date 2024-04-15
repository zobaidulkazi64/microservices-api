import express from "express";
const router = express.Router();

import { createUser, getUserById } from "../controllers";

router.post("/create", createUser);

// get user by id
router.get("/user/:id", getUserById);

export default router;

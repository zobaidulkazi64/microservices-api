import express from "express";
const router = express.Router();

import { userRegistration, userLogin, verifyEmail, verifyToken } from "../controllers";

// user registration
router.post("/register", userRegistration);

// user login
router.post("/login", userLogin);

// verify email
router.post("/verify-email", verifyEmail);

// verify token
router.post("/verify-token", verifyToken);
export default router;

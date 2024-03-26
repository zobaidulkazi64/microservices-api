import express from "express";
const router = express.Router();
import { getEmails, sendEmail } from "../controllers";

// routes
router.get("/get-email", getEmails);
router.post("/send", sendEmail);

export default router;

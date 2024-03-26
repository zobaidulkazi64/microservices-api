import { Response, Request, NextFunction } from "express";
import prisma from "../prisma";

const getEmails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const emails = await prisma.email.findMany();

    res.json(emails);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getEmails;

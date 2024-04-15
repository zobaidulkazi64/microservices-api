import { Request, Response, NextFunction } from "express";
import { UserCreateSchema } from "../schema";
import prisma from "../prisma";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate the request body
    const parsedBody = UserCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        errors: parsedBody.error.errors,
      });
    }
    // check if AuthUser  already exists

    const existingUser = await prisma.user.findUnique({
      where: {
        authUserId: parsedBody.data.authUserId,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // create a new User
    const newUser = await prisma.user.create({
      data: {
        ...parsedBody.data,
      },
    });

    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default createUser;

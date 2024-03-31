import { NextFunction, Request, Response } from "express";

export const createProducts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.body();
  } catch (error) {
    console.log(error);
  }
};

export default createProducts;

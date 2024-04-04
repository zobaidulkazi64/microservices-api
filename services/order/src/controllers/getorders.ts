import { Request, Response } from "express";


export getOrders = (req: Request, res: Response) => {
    res.send("Hello, I am order service on port 4001");
}
import { Request, Response, NextFunction } from "express";
import config from "./config.json";
import axios from "axios";

export const createHandler =
  (hostname: string, path: string, methods: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let url = `${hostname}${path}`;

      req.params &&
        Object.keys(req.params).forEach((key) => {
          url = url.replace(`:${key}`, req.params[key]);
        });

      const response = await axios({
        method: req.method,
        url,
        data: req.body,
        headers: {
          origin: "http://localhost:8081",
          "x-user-id": req.headers["x-user-id"] || "",
          "x-user-email": req.headers["x-user-email"] || "",
          "x-user-role": req.headers["x-user-role"] || "",
          "x-user-name": req.headers["x-user-name"] || "",
          "user-agent": req.headers["user-agent"] || "",
        },
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      console.log(error);
      if (error instanceof axios.AxiosError) {
        return res.status(error.response?.status || 500).json({
          message: error.response?.data?.message || "Internal Server Error",
        });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const createHandlerWithParams =
  (hostname: string, path: string, methods: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {}
  };

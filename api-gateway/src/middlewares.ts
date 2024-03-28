import axios from "axios";
import { Request, Response, NextFunction } from "express";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers["authorization"]) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const { data } = await axios.post("http://localhost:4001/verify-token", {
      accessToken: token,
      headers: {
        ip: (req.headers["x-forwarded-for"] as string) || req.ip || "",
        userAgent: (req.headers["user-agent"] as string) || "no-user-agent",
      },
    });
    req.headers["x-user-id"] = data.user.id;
    req.headers["x-user-email"] = data.user.email;
    req.headers["x-user-role"] = data.user.role;
    req.headers["x-user-name"] = data.user.name;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const middleware = { auth };

export default middleware;

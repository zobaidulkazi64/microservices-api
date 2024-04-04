import express from "express";
import axios from "axios";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import router from "./routes";
import "./receiver";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/email", router);

app.get("/health", (req, res) => {
  res.send(`Hello!, I am live on!, on port 4005`);
});

app.get("/", (req, res) => {
  res.send(`<h1>Hello, I am email service on port 4005</h1>`);
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// 500 handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// 400 handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(400).json({ message: "Bad Request" });
});

const port = process.env.PORT || 4005;
const serviceName = process.env.SERVICE_NAME || "email-service";

app.listen(port, () => {
  console.log(`${serviceName} started on port ${port}`);
});

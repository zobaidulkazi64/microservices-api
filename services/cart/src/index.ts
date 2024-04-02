import express from "express";
import axios from "axios";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import router from "./routes";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/cart", router);

app.get("/health", (req, res) => {
  res.send(`Hello!, I am live on!, on port 4006`);
});

app.get("/", (req, res) => {
  res.send(`<h1>Hello, I am cart service on port 4006</h1>`);
})

const port = process.env.PORT || 4006;
const serviceName = process.env.SERVICE_NAME || "email-service";

app.listen(port, () => {
  console.log(`${serviceName} started on port ${port}`);
});

import express from "express";
import axios from "axios";
import morgan from "morgan";
import cors from "cors";

// routes
import router from "./routes";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// call routes

app.use("/api", router);

app.get("/health", (req, res) => {
  res.send("Hello!, I am live on!, on port 4003");
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

const port = process.env.PORT || 4003;
const serviceName = process.env.SERVICE_NAME || "inventory-service";

app.listen(port, () => {
  console.log(`${serviceName} started on port ${port}`);
});

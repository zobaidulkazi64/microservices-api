import { Redis } from "ioredis";
// import {} from './config';

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

export default redis;

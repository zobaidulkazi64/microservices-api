import amqp from "amqplib";
import redis from "./radis";

const receiveFromQueue = async (
  queueName: string,
  callback: (message: string) => void
) => {
  // create connection
};



export default receiveFromQueue;
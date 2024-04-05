import amqp from "amqplib";

const sendToQueue = async (queue: string, message: string) => {
  // create connection
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchangeName = "order";
  await channel.assertExchange(exchangeName, "direct", {
    durable: true,
  });

  channel.publish(exchangeName, queue, Buffer.from(message));

  console.log(`Message sent to queue ${queue}`);

  setTimeout(() => {
    connection.close();
  }, 500);
};

export default sendToQueue;

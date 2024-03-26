import amqp from "amqplib";
import { defaultSender, transporter } from "./config";
import prisma from "./prisma";

const receiveFromQueue = async (
  queueName: string,
  callback: (message: string) => void
) => {
  // create connection
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  // create queue
  const exchangeName = "order";
  await channel.assertExchange(exchangeName, "direct", {
    durable: true,
  });

  // create queue
  const q = await channel.assertQueue("queue", {
    durable: true,
  });

  // bind queue to exchange

  channel.consume(q.queue, (msg) => {
    if (msg) {
      callback(msg.content.toString());
    }
    {
      noAck: true;
    }
  });
};

receiveFromQueue("send-email", async (message) => {
  const parsedBody = JSON.parse(message);

  const { userEmail, grandTotal, id } = parsedBody;
  const from = defaultSender;
  const subject = `Order Confirmation`;
  const body = `Thank you for your order. Your order id is ${id}. Your total amount is ${grandTotal}`;

  const emailOptions = {
    from,
    to: userEmail,
    subject,
    text: body,
  };

  // send email
  const { rejection } = await transporter.sendMail(emailOptions);

  if (rejection.length) {
    console.log("Email not sent", rejection);
    return;
  }
  await prisma.email.create({
    data: {
      sender: from,
      recipient: userEmail,
      subject,
      body,
      source: "Order Confirmation",
    },
  });

  await prisma.email.create({
    data: {
      sender: from,
      recipient: userEmail,
      subject,
      body,
      source: "Order Confirmation",
    },
  });
  console.log("Email sent");
});

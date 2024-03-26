import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { EmailCreateSchema } from "@/schema";
import { defaultSender, transporter } from "@/config";

const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate request body
    const parsedBody = EmailCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        error: parsedBody.error.errors,
      });
    }

    // create mail options
    const { sender, recipient, subject, body, source } = parsedBody.data;
    const from = sender || defaultSender;
    const emailOptions = {
      from,
      to: recipient,
      subject,
      text: body,
    };

    // send email
    const emailSource = source || "email";
    const { rejection } = await transporter.sendMail(emailOptions);
    if (rejection.length) {
      console.log("Email not sent", rejection);
      return res
        .status(500)
        .json({ message: "Email not sent", error: rejection });
    }

    await prisma.email.create({
      data: {
        sender: from,
        recipient,
        subject,
        body,
        source: emailSource,
      },
    });

    return res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default sendEmail;

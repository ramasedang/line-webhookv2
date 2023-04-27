import express from "express";
import morganMiddleware from "../middlewares/morgan.middleware.js";
import * as line from "@line/bot-sdk";

const router = express.Router();
router.use(morganMiddleware);

const config = {
  channelAccessToken:
    "lvxQDhU8NA53MNUQotP7LubKR6pIJnqm6cqeAxpA+TrbS0hn09g3sI5qMVv7YBixCHobjaW7TwgbBHif8IUyah5sG9t1xOvK/2D3jAREUy/pedjxweYzkJERvxyrqS80p8WymSbAUjSKbPosHd4AXAdB04t89/1O/w1cDnyilFU=",
  channelSecret: "8f72e1742c464a5e8f6b36b3a8736aaa",
};

const client = new line.Client(config);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/webhook", async (req, res) => {
  const events = req.body.events;

  // Proses setiap event
  await Promise.all(events.map(handleEvent));

  res.sendStatus(200);
});

// Tambahkan endpoint untuk mengirim pesan
router.post("/send-message", async (req, res) => {
  const { userId, text } = req.body;

  if (!userId || !text) {
    res.status(400).send({ message: "userId and text are required" });
    return;
  }

  const message = {
    type: "text",
    text: text,
  };

  try {
    await client.pushMessage(userId, message);
    res.status(200).send({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to send message" });
  }
});

async function handleEvent(event) {
  if (event.type === "message" && event.message.type === "text") {
    const echo = {
      type: "text",
      text: `Anda mengirim: ${event.message.text}`,
      userId: event.source.userId,
    };

    await client.replyMessage(event.replyToken, echo);
  }
}

export default router;

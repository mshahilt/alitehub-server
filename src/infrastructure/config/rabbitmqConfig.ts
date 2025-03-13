import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";
const QUEUE_NAME = "notifications";

let channel: amqp.Channel | null = null;

/**
 * Connect to RabbitMQ and create a channel.
 */
export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);
    console.log("✅ Connected to RabbitMQ");
  } catch (error) {
    console.error("❌ RabbitMQ Connection Error:", error);
    process.exit(1);
  }
};

/**
 * Send a notification message to RabbitMQ.
 */
export const sendNotification = async (message: object) => {
  if (!channel) {
    console.error("❌ RabbitMQ channel is not initialized");
    return;
  }

  try {
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
    console.log("📩 Sent notification:", message);
  } catch (error) {
    console.error("❌ Error sending notification:", error);
  }
};

/**
 * Consume notification messages from RabbitMQ and emit to Socket.IO.
 */
export const consumeNotifications = async (io: any, userSocketMap: Map<string, string>) => {
  if (!channel) {
      console.error("❌ RabbitMQ channel is not initialized");
      return;
  }

  try {
      await channel.consume(QUEUE_NAME, (msg) => {
          if (msg !== null) {
              const message = JSON.parse(msg.content.toString());
              console.log("📩 Received notification:", message);

              // Get the recipient's socket ID from the map
              const recipientSocketId = userSocketMap.get(message.receiverId);

              if (recipientSocketId) {
                  io.to(recipientSocketId).emit("receive_notification", message);
                  console.log(`📤 Notification sent to user ${message.receiverId}`);
              } else {
                  console.log(`⚠️ User ${message.receiverId} is not online`);
              }

              channel!.ack(msg);
          }
      });

      console.log("👂 Listening for RabbitMQ notifications...");
  } catch (error) {
      console.error("❌ Error consuming notifications:", error);
  }
};

import { MessageController } from "../controllers/MessageController";
import { MessageUseCase } from "../../application/useCases/MessageUseCase";
import { MessageRepository } from "../../infrastructure/repositories/MessageRepository";
import { ChatRepository } from "../../infrastructure/repositories/ChatRepository";
import express from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const messageRepository = new MessageRepository();
const chatRepository = new ChatRepository();
const createdMessageUseCase = new MessageUseCase(messageRepository, chatRepository);
const messageController = new MessageController(createdMessageUseCase);

router.get('/', AuthMiddleware("both"), async(req, res) => {
    await messageController.fetchChats(req,res);   
})
router.post('/', AuthMiddleware("both"), async(req, res) => {
    await messageController.createChat(req,res);
});
router.get('/messages/:chatId', AuthMiddleware("both"), async(req, res) => {
    await messageController.fetchMessasges(req, res);
})
router.post('/messages', AuthMiddleware("both"), async (req,res) => {
    await messageController.createMessage(req, res);
})

export default router
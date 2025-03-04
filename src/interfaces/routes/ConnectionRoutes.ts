import express from "express";
import { ConnectionUseCase } from "../../application/useCases/ConnectionUseCase";
import { ConnectionRepository } from "../../infrastructure/repositories/ConnectionRepository";
import { ConnectionController } from "../controllers/ConnectionController";
import { AuthMiddleware } from "../middlewares/authMiddleware";


const router = express.Router();
const connectionRepository = new ConnectionRepository();
const connectionUseCase = new ConnectionUseCase(connectionRepository);
const connectionController = new ConnectionController(connectionUseCase);

router
    .post("/",AuthMiddleware("user"), async (req, res) => {
        await connectionController.createConnection(req, res);
    })
    .put("/:connectionId/accept",AuthMiddleware("user"), async (req, res) => {
        await connectionController.acceptConnection(req, res);
    })
    .put("/:connectionId/decline",AuthMiddleware("user"), async (req, res) => {
        await connectionController.declineConnection(req, res);
    })
    .get("/pending",AuthMiddleware("user"), async (req, res) => {
        await connectionController.findPendingRequests(req, res);
    })
    .get("/:userId/connections",AuthMiddleware("user"), async (req, res) => {
        await connectionController.findUserConnections(req, res);
    })
    .delete("/:connectionId",AuthMiddleware("user"), async (req, res) => {
        await connectionController.deleteConnection(req, res);
    });

export default router;
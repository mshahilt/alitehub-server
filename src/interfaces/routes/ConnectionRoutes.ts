import express from "express";
import { ConnectionUseCase } from "../../application/useCases/ConnectionUseCase";
import { ConnectionRepository } from "../../infrastructure/repositories/ConnectionRepository";
import { ConnectionController } from "../controllers/ConnectionController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepository";


const router = express.Router();
const connectionRepository = new ConnectionRepository();
const userRepository = new UserRepositoryImpl();
const connectionUseCase = new ConnectionUseCase(connectionRepository, userRepository);
const connectionController = new ConnectionController(connectionUseCase);

router
    .post("/",AuthMiddleware("user"), async (req, res) => {
        await connectionController.createConnection(req, res);
    })
    .get('/', AuthMiddleware("user"),async (req, res) => {
        await connectionController.findOwnUserConnection(req, res);
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
    .get("/:userId/count",AuthMiddleware("both"), async (req, res) => {
        await connectionController.findUserConnectionsCount(req, res);
    })
    .delete("/:connectionId",AuthMiddleware("user"), async (req, res) => {
        await connectionController.deleteConnection(req, res);
    });

export default router;
import express, {Response, Request} from "express";
import { CallRepositoryImpl } from "../../infrastructure/repositories/CallRepository";
import { CallUseCase } from "../../application/useCases/CallUseCase";
import { CallController } from "../controllers/CallController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { ApplicationRepositoryImpl } from "../../infrastructure/repositories/ApplicationRepository";
import { ApplicationUseCase } from "../../application/useCases/ApplicationUseCase";
import { rooms } from "../../infrastructure/services/SocketHandler";

const router = express.Router();
const callRepository = new CallRepositoryImpl();
const applicationRepository = new ApplicationRepositoryImpl();
const createdApplicationUseCase = new ApplicationUseCase(applicationRepository);
const createdCallUseCase = new CallUseCase(callRepository);
const callController = new CallController(createdCallUseCase, createdApplicationUseCase);

// Schedule an interview (company only)
router.post('/interview', AuthMiddleware("company"), async(req: Request, res: Response) => {
    await callController.scheduleInterview(req, res);
});

// Get interview information
router.get('/interview/:roomId', AuthMiddleware("any"), async(req: Request, res: Response) => {
    await callController.getInterviewById(req, res);
});

router.get("/room/:roomId", AuthMiddleware("any"), (req: Request, res: Response) => {
    const {roomId} = req.params;

    if(rooms.has(roomId)) {
        const room = rooms.get(roomId);
        res.json({ exists: true, participants: room ? room.size : 0 });
    } else {
        res.json({ exists: false, participants: 0 });
    }
});

// // Get all upcoming interviews for a user or company
// router.get("/upcoming", AuthMiddleware("any"), async(req: Request, res: Response) => {
//     await callController.getUpcomingInterviews(req, res);
// });

// // Update interview status (complete, cancelled, reschedule)
// router.patch('/interview/:id', AuthMiddleware("any"), async(req: Request, res: Response) => {
//     await callController.updateInterviewStatus(req, res);
// });

export default router;
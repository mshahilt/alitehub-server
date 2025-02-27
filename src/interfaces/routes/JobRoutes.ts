import express, { Response, Request } from "express";
import { JobRepositoryImpl } from "../../infrastructure/repositories/JobRepository";
import { JobUseCase } from "../../application/useCases/JobUseCase";
import { JobController } from "../controllers/JobController";



const router = express.Router();
const jobRepository = new JobRepositoryImpl();
const createdJobUseCase = new JobUseCase(jobRepository);
const jobController = new JobController(createdJobUseCase);


router.post('/applyWithAnswers',async(req: Request, res: Response) => {
    await jobController.applyForJob(req, res);
})
router.get('/', async (req: Request, res: Response) => {
    await jobController.fetchJobs(req, res);
});
router.post("/generateQuizQuestions", async(req: Request, res: Response) => {
    await jobController.generateQuizQuestions(req, res);
})
router.post("/add", async(req: Request, res: Response) => {
    await jobController.addJobPost(req, res);
})
router.get('/:jobId', async (req: Request, res: Response) => {
    await jobController.fetchJobById(req, res);
});
router.get('/quiz/:jobId', async(req:Request, res: Response) => {
    await jobController.fetchQuizByJobId(req, res);
})

export {jobController}
export default express.Router()
 import express from "express";
import { ApplicationController } from "../controllers/ApplicationController";
import { ApplicationUseCase } from "../../application/useCases/ApplicationUseCase";
import { ApplicationRepositoryImpl } from "../../infrastructure/repositories/ApplicationRepository";

const router = express.Router();

const applicationRepository = new ApplicationRepositoryImpl();
const applicationUseCase = new ApplicationUseCase(applicationRepository);
const applicationController = new ApplicationController(applicationUseCase);


router.get('/company', async (req, res) => {
    await applicationController.fetchApplicationsOfJob(req, res);
});

router.get('/user', async (req, res) => {
    await applicationController.fetchApplicationsOfUser(req, res);
});
router.get('/:id', async (req, res) => {
    await applicationController.fetchApplicationById(req, res);
});



export default router;

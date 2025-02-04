import express from "express";

import { Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    // console.log("token from frontend",req.headers.authorization)
    res.status(200).json({"message" : "Server is fine buddy..!"})
})

export default router;
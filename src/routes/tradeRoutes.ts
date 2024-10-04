import { Router } from "express";
import { trade } from "../controllers/tradingController";

const router = Router();

router.get("/trade", trade);

export default router;

import { Router } from "express";
import { trade } from "../controllers/tradingController";

/**
 * Express Router to handle trading-related routes.
 * 
 * GET /trade: Triggers trade execution logic defined in the tradingController.
 * 
 */
const router = Router();

router.get("/trade", trade);

export default router;

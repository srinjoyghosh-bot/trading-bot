import { Request, Response, NextFunction } from "express";
import { executeTrades, getProfitLossReport } from "../service/tradingService";
import logger from "../utils/logger";

export const trade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('Received trade execution request');
  try {
    await executeTrades();
    logger.info('Trade execution successful, sending report');
    res.status(200).json(getProfitLossReport());
  } catch (error) {
    logger.error(`Trade execution error: ${(error as Error).message}`);
    next(error)
  }
};

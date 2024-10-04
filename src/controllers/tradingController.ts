import { Request, Response, NextFunction } from "express";
import { executeTrades, getProfitLossReport } from "../service/tradingService";
import logger from "../utils/logger";

/**
 * Controller function for executing trade operations via HTTP request.
 * Responds with current profit/loss or error details if execution fails.
 *
 * @param req Express Request object
 * @param res Express Response object
 * @param next Express NextFunction for middleware chaining
 */
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

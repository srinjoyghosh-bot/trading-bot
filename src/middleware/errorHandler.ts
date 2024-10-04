import { Request, Response, NextFunction } from 'express';
import { TradingBotError } from '../utils/tradingBotError';
import logger from '../utils/logger';

/**
 * Middleware for handling errors thrown during request processing.
 * Differentiates between known TradingBotErrors and generic errors, ensuring proper logging and HTTP response.
 *
 * @param err The error to handle
 * @param req Express Request object
 * @param res Express Response object
 * @param next Express NextFunction
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof TradingBotError) {
    logger.error(`TradingBotError: ${err.message}`);
    res.status(400).json({ error: err.message });
  } else {
    logger.error(`Unhandled Error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
}

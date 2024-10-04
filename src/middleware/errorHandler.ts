import { Request, Response, NextFunction } from 'express';
import { TradingBotError } from '../utils/tradingBotError';
import logger from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof TradingBotError) {
    logger.error(`TradingBotError: ${err.message}`);
    res.status(400).json({ error: err.message });
  } else {
    logger.error(`Unhandled Error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
}

import { Request, Response, NextFunction } from 'express';
import { TradingBotError } from '../utils/tradingBotError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof TradingBotError) {
    console.error(`TradingBotError: ${err.message}`);
    res.status(400).json({ error: err.message });
  } else {
    console.error(`Unhandled Error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
}

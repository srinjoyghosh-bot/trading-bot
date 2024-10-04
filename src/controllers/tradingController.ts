import { Request, Response, NextFunction } from "express";
import { executeTrades, getProfitLossReport } from "../service/tradingService";

export const trade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await executeTrades();
    res.status(200).json(getProfitLossReport());
  } catch (error) {
    next(error)
  }
};

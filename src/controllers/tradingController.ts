import { Request, Response } from "express";
import { executeTrades, getProfitLossReport } from "../service/tradingService";

export const trade = async (req: Request, res: Response) => {
  try {
    await executeTrades();
    res.status(200).json(getProfitLossReport());
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

import fs from "fs";
import { TradingBotError } from "../utils/tradingBotError";

export const readFileSyncSafe = (filePath: string): string => {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    throw new TradingBotError(
      `Failed to read file at ${filePath}: ${(error as Error).message}`
    );
  }
}

export const writeFileSyncSafe = (filePath: string, data: string): void => {
  try {
    fs.writeFileSync(filePath, data, "utf-8");
  } catch (error) {
    throw new TradingBotError(
      `Failed to write file at ${filePath}: ${(error as Error).message}`
    );
  }
}

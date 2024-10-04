import fs from "fs";
import { TradingBotError } from "../utils/tradingBotError";
import logger from "./logger";
export const readFileSyncSafe = (filePath: string): string => {
  try {
    logger.debug(`Reading file: ${filePath}`);
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    logger.error(`Failed to read file at ${filePath}: ${(error as Error).message}`);
    throw new TradingBotError(
      `Failed to read file at ${filePath}: ${(error as Error).message}`
    );
  }
}

export const writeFileSyncSafe = (filePath: string, data: string): void => {
  try {
    logger.debug(`Writing to file: ${filePath}`);
    fs.writeFileSync(filePath, data, "utf-8");
  } catch (error) {
    logger.error(`Failed to parse JSON data: ${(error as Error).message}`);
    throw new TradingBotError(
      `Failed to write file at ${filePath}: ${(error as Error).message}`
    );
  }
}

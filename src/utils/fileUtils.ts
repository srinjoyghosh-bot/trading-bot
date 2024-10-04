import fs from "fs";
import { TradingBotError } from "../utils/tradingBotError";
import logger from "./logger";

/**
 * Reads a file and returns its content as a string, with logging and error handling.
 * @param filePath The path to the file to read.
 * @returns Content of the file as a string.
 * @throws TradingBotError if reading the file fails.
 */
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

/**
 * Writes data to a file, with logging and error handling.
 * @param filePath The path to the file where data should be written.
 * @param data The data to write as a string.
 * @throws TradingBotError if writing to the file fails.
 */
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

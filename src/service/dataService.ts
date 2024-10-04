import path from "path";
import { Trade } from "../models/trade";
import { HistoricalPrice, Stock } from "../models/stock";
import { TradingBotError } from "../utils/tradingBotError";
import { readFileSyncSafe, writeFileSyncSafe } from "../utils/fileUtils";
import logger from "../utils/logger";

const pricesFilePath = path.join(__dirname, "../../data/prices.json");
const tradesFilePath = path.join(__dirname, "../../data/trades.json");
const holdingsFilePath = path.join(__dirname, "../../data/holdings.json");

/**
 * Parses a JSON string into an object with error handling.
 * @param data The JSON string to parse.
 * @returns The parsed JSON object.
 * @throws TradingBotError if parsing the JSON string fails.
 */
function parseJSONSafe<T>(data: string): T {
  try {
    return JSON.parse(data);
  } catch (error) {
    throw new TradingBotError(
      `Failed to parse JSON: ${(error as Error).message}`
    );
  }
}

/**
 * Retrieves the historical stock prices for a given symbol.
 * @param symbol The stock symbol to retrieve the price for.
 * @returns Array of historical prices or undefined if not found.
 */
export function getStockPrices(symbol: string): HistoricalPrice[] | undefined {
  logger.info(`Fetching stock prices for symbol: ${symbol}`);
  // This is where a call to a third party API should be made.
  const pricesData = parseJSONSafe<Stock[]>(readFileSyncSafe(pricesFilePath));
  const stock = pricesData.find(stock => stock.symbol === symbol);
  return stock?.prices;
}

/**
 * Fetches all recorded trades from the trades data file.
 * @returns An array of Trade objects.
 */
export function getAllTrades(): Trade[] {
  logger.info('Fetching all trades');
  return parseJSONSafe<Trade[]>(readFileSyncSafe(tradesFilePath));
}

/**
 * Logs a trade by appending it to the trades data file.
 * @param trade The trade object to be logged.
 */
export function logTrade(trade: Trade): void {
  logger.info(`Logging trade: ${JSON.stringify(trade)}`); 
  const tradesData = getAllTrades();
  tradesData.push(trade);
  writeFileSyncSafe(tradesFilePath, JSON.stringify(tradesData, null, 2));
}

/**
 * Fetches current stock holdings from the holdings data file.
 * @returns An object representing holdings with symbols as keys and quantities as values.
 */
export function getHoldings(): { [symbol: string]: number } {
  logger.info('Fetching holdings');
  return parseJSONSafe<{ [symbol: string]: number }>(readFileSyncSafe(holdingsFilePath));
}

/**
 * Updates the quantity for a given stock symbol in the holdings data file.
 * @param symbol The stock symbol to update.
 * @param quantity The new quantity to be set for the symbol.
 */
export function updateHoldings(symbol: string, quantity: number): void {
  logger.info(`Updating holdings for ${symbol}: ${quantity}`);
  const holdingsData = getHoldings();
  holdingsData[symbol] = quantity;
  writeFileSyncSafe(holdingsFilePath, JSON.stringify(holdingsData, null, 2));
}

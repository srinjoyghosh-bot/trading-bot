import path from "path";
import { Trade } from "../models/trade";
import { Stock } from "../models/stock";
import { TradingBotError } from "../utils/tradingBotError";
import { readFileSyncSafe, writeFileSyncSafe } from "../utils/fileUtils";

const pricesFilePath = path.join(__dirname, "../../data/prices.json");
const tradesFilePath = path.join(__dirname, "../../data/trades.json");
const holdingsFilePath = path.join(__dirname, "../../data/holdings.json");

function parseJSONSafe<T>(data: string): T {
  try {
    return JSON.parse(data);
  } catch (error) {
    throw new TradingBotError(
      `Failed to parse JSON: ${(error as Error).message}`
    );
  }
}

export function getStockPrice(symbol: string): number | undefined {
  const pricesData = parseJSONSafe<Stock[]>(readFileSyncSafe(pricesFilePath));
  const stock = pricesData.find(stock => stock.symbol === symbol);
  return stock?.price;
}

export function getAllTrades(): Trade[] {
  return parseJSONSafe<Trade[]>(readFileSyncSafe(tradesFilePath));
}

export function logTrade(trade: Trade): void {
  const tradesData = getAllTrades();
  tradesData.push(trade);
  writeFileSyncSafe(tradesFilePath, JSON.stringify(tradesData, null, 2));
}

export function getHoldings(): { [symbol: string]: number } {
  return parseJSONSafe<{ [symbol: string]: number }>(readFileSyncSafe(holdingsFilePath));
}

export function updateHoldings(symbol: string, quantity: number): void {
  const holdingsData = getHoldings();
  holdingsData[symbol] = quantity;
  writeFileSyncSafe(holdingsFilePath, JSON.stringify(holdingsData, null, 2));
}

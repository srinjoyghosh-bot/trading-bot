import path from "path";
import { Trade } from "../models/trade";
import { readFileSyncSafe, writeFileSyncSafe } from "../utils/fileUtils";

const pricesFilePath = path.join(__dirname, "../../data/prices.json");
const tradesFilePath = path.join(__dirname, "../../data/trades.json");
const holdingsFilePath = path.join(__dirname, "../../data/holdings.json");

export function getStockPrice(symbol: string): number | undefined {
  const pricesData = JSON.parse(readFileSyncSafe(pricesFilePath));
  return pricesData[symbol];
}

export function getAllTrades(): Trade[] {
  return JSON.parse(readFileSyncSafe(tradesFilePath));
}

export function logTrade(trade: Trade): void {
  const tradesData = getAllTrades();
  tradesData.push(trade);
  writeFileSyncSafe(tradesFilePath, JSON.stringify(tradesData, null, 2));
}

export function getHoldings(): { [symbol: string]: number } {
  return JSON.parse(readFileSyncSafe(holdingsFilePath));
}

export function updateHoldings(symbol: string, quantity: number): void {
  const holdingsData = getHoldings();
  holdingsData[symbol] = quantity;
  writeFileSyncSafe(holdingsFilePath, JSON.stringify(holdingsData, null, 2));
}

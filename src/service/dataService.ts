import fs from 'fs';
import path from 'path';
import { Trade } from '../models/trade';

const pricesFilePath = path.join(__dirname, '../../data/prices.json');
const tradesFilePath = path.join(__dirname, '../../data/trades.json');
const holdingsFilePath = path.join(__dirname, '../../data/holdings.json');

export function getStockPrice(symbol: string): number | undefined {
  const pricesData = JSON.parse(fs.readFileSync(pricesFilePath, 'utf-8'));
  return pricesData[symbol];
}

export function getAllTrades(): Trade[] {
  return JSON.parse(fs.readFileSync(tradesFilePath, 'utf-8'));
}

export function logTrade(trade: Trade): void {
  const tradesData = getAllTrades();
  tradesData.push(trade);
  fs.writeFileSync(tradesFilePath, JSON.stringify(tradesData, null, 2));
}

export function getHoldings(): { [symbol: string]: number } {
  return JSON.parse(fs.readFileSync(holdingsFilePath, 'utf-8'));
}

export function updateHoldings(symbol: string, quantity: number): void {
  const holdingsData = getHoldings();
  holdingsData[symbol] = quantity;
  fs.writeFileSync(holdingsFilePath, JSON.stringify(holdingsData, null, 2));
}

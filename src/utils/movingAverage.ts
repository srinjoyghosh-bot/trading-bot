import { HistoricalPrice } from '../models/stock';

/**
 * Calculates a simple moving average given a list of historical prices and the period length.
 * @param prices List of historical prices.
 * @param period Length of the moving average period.
 * @returns The calculated moving average or NaN if the period is longer than the list of prices.
 */
export function calculateMovingAverage(prices: HistoricalPrice[], period: number): number {
  const relevantPrices = prices.slice(-period).map(p => p.price);
  const sum = relevantPrices.reduce((acc, price) => acc + price, 0);
  return relevantPrices.length === period ? sum / period : NaN;
}

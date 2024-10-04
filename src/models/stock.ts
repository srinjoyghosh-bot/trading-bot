/**
 * Stock interface represents a stock asset with a symbol and its current price.
 */
export interface Stock {
  symbol: string; // The ticker symbol, e.g., 'AAPL'
  prices: HistoricalPrice[]; // The current price for the stock
}

/**
 * HistoricalPrice represents the price of a stock at a specific moment.
 */
export interface HistoricalPrice {
    timestamp: string; // ISO date string
    price: number;     // Price at the given time
  }

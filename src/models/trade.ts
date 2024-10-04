/**
 * Trade interface defines the structure of a trading action, either buy or sell.
 */
export interface Trade {
  type: "buy" | "sell"; // Type of trade
  price: number; // Price at which the trade was conducted
  quantity: number; // Number of shares traded
  symbol: string; // Stock symbol for the trade
  timestamp: Date; // Date and time when the trade was made
}

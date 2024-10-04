export interface Trade {
  type: "buy" | "sell";
  price: number;
  quantity: number;
  symbol: string;
  timestamp: Date;
}

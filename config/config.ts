export const TRADING_BOT_CONFIG = {
  initialBalance: 100000,
  tradeRules: {
    buyThreshold: -0.02, // Buy when price drops by 2%
    sellThreshold: 0.03, // Sell when price rises by 3%
  },
  stocks: ["AAPL", "GOOG", "AMZN", "MSFT", "TSLA"], // monitored stocks
};

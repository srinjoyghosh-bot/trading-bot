export const TRADING_BOT_CONFIG = {
  initialBalance: 100000,
  tradeRules: {
    buyThreshold: -0.02, // Buy when price drops by 2%
    sellThreshold: 0.03, // Sell when price rises by 3%
  },
  stocks: ["AAPL", "GOOG", "AMZN", "MSFT", "TSLA"], // monitored stocks
  movingAveragePeriods: {
    shortTerm: 5,  // Period for the short-term moving average
    longTerm: 20,  // Period for the long-term moving average
  }
};

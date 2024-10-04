/**
 * TradingBotError is a custom error class used for handling trading bot errors.
 * Extends the Error class with a custom name.
 */
export class TradingBotError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TradingBotError";
  }
}

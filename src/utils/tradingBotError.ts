export class TradingBotError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TradingBotError";
  }
}

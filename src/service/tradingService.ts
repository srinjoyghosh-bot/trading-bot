import {
  getStockPrice,
  logTrade,
  getAllTrades,
  getHoldings,
  updateHoldings,
} from "./dataService";
import { Trade } from "../models/trade";
import { TRADING_BOT_CONFIG } from "../../config/config";
import { TradingBotError } from "../utils/tradingBotError";

let balance = TRADING_BOT_CONFIG.initialBalance;

export const executeTrades = async () => {
  try {
    const holdings = getHoldings();
    const symbols = TRADING_BOT_CONFIG.stocks;

    symbols.forEach((symbol) => {
      const currentPrice = getStockPrice(symbol);
      if (currentPrice === undefined) {
        throw new TradingBotError(`No price found for symbol ${symbol}`);
      }
      const lastTrades = getAllTrades();
      lastTrades.reverse();
      const lastTrade = lastTrades.find((trade) => trade.symbol === symbol);

      if (currentPrice !== undefined) {
        if (lastTrade) {
          const priceChange =
            (currentPrice - lastTrade.price) / lastTrade.price;

          if (
            lastTrade.type === "buy" &&
            priceChange >= TRADING_BOT_CONFIG.tradeRules.sellThreshold
          ) {
            sell(symbol, currentPrice, holdings);
          } else if (
            lastTrade.type === "sell" &&
            priceChange <= TRADING_BOT_CONFIG.tradeRules.buyThreshold
          ) {
            buy(symbol, currentPrice, holdings);
          }
        } else {
          // First trade action for this symbol; attempt to buy if no holdings exist
          buy(symbol, currentPrice, holdings);
        }
      }
    });
  } catch (error) {
    throw error instanceof TradingBotError
      ? error
      : new TradingBotError(
          `Error executing trades: ${(error as TradingBotError).message}`
        );
  }
};

const buy = (
  symbol: string,
  price: number,
  holdings: { [key: string]: number }
) => {
  try {
    const quantity = Math.floor(balance / price);
    if (quantity > 0) {
      balance -= quantity * price;
      const currentQuantity = holdings[symbol] || 0;
      updateHoldings(symbol, currentQuantity + quantity);
      const trade: Trade = {
        type: "buy",
        price,
        quantity,
        symbol,
        timestamp: new Date(),
      };
      logTrade(trade);
      console.log(`Bought ${quantity} shares of ${symbol} at $${price}`);
    }
  } catch (error) {
    throw error instanceof TradingBotError
      ? error
      : new TradingBotError(
          `Error buying stock ${symbol}: ${(error as TradingBotError).message}`
        );
  }
};

const sell = (
  symbol: string,
  price: number,
  holdings: { [key: string]: number }
) => {
  try {
    const holding = holdings[symbol] || 0;
    if (holding > 0) {
      balance += holding * price;
      updateHoldings(symbol, 0);
      const trade: Trade = {
        type: "sell",
        price,
        quantity: holding,
        symbol,
        timestamp: new Date(),
      };
      logTrade(trade);
      console.log(`Sold ${holding} shares of ${symbol} at $${price}`);
    }
  } catch (error) {
    throw error instanceof TradingBotError
      ? error
      : new TradingBotError(
          `Error selling stock ${symbol}: ${(error as TradingBotError).message}`
        );
  }
};

export const getProfitLossReport = () => {
  try {
    const holdings = getHoldings();
    const marketValue = Object.keys(holdings).reduce((sum, symbol) => {
      const price = getStockPrice(symbol);
      return sum + holdings[symbol] * (price ?? 0);
    }, 0);
    const totalValue = balance + marketValue;
    const profitLoss = totalValue - TRADING_BOT_CONFIG.initialBalance;
    return {
      balance,
      holdings,
      profitLoss,
    };
  } catch (error) {
    throw error instanceof TradingBotError
      ? error
      : new TradingBotError(
          `Error generating profit/loss report: ${
            (error as TradingBotError).message
          }`
        );
  }
};

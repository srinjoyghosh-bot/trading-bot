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
import logger from "../utils/logger";

let balance = TRADING_BOT_CONFIG.initialBalance;

/**
 * Executes trading strategies based on stock prices and historical trade data.
 * Determines whether to buy or sell stocks based on predefined rules like price changes.
 * @throws TradingBotError if any part of the trade execution logic fails.
 */
export const executeTrades = async () => {
  logger.info('Executing trades');
  try {
    const holdings = getHoldings();
    const symbols = TRADING_BOT_CONFIG.stocks;

    symbols.forEach((symbol) => {
      const currentPrice = getStockPrice(symbol);
      if (currentPrice === undefined) {
        logger.warn(`No price found for symbol ${symbol}`);
        throw new TradingBotError(`No price found for symbol ${symbol}`);
      }
      const lastTrades = getAllTrades();
      lastTrades.reverse();
      const lastTrade = lastTrades.find((trade) => trade.symbol === symbol);

        // Calculating price change and making appropriate trade decisions
        if (lastTrade) {
          const priceChange =
            (currentPrice - lastTrade.price) / lastTrade.price;
            logger.debug(`Price change for ${symbol}: ${priceChange}`);
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
          // First trade action for this symbol; buying if no holdings exist
          buy(symbol, currentPrice, holdings);
        }
      
    });
  } catch (error) {
    logger.error(`Error executing trades: ${(error as Error).message}`);
    throw error instanceof TradingBotError
      ? error
      : new TradingBotError(
          `Error executing trades: ${(error as Error).message}`
        );
  }
};

/**
 * Attempts to buy stock by evaluating current holdings, updating balance and recording the trade.
 * @param symbol The stock symbol to buy.
 * @param price The price per share for buying.
 * @param holdings Current object depicting all stock holdings.
 * @throws TradingBotError if buying logic fails.
 */
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
      logger.info(`Bought ${quantity} shares of ${symbol} at $${price}`);
    }
  } catch (error) {
    logger.error(`Error buying stock ${symbol}: ${(error as Error).message}`);
    throw error instanceof TradingBotError
      ? error
      : new TradingBotError(
          `Error buying stock ${symbol}: ${(error as Error).message}`
        );
  }
};

/**
 * Attempts to sell stock by evaluating current holdings, updating balance and recording the trade.
 * @param symbol The stock symbol to sell.
 * @param price The price per share for selling.
 * @param holdings Current object depicting all stock holdings.
 * @throws TradingBotError if selling logic fails.
 */
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
      logger.info(`Sold ${holding} shares of ${symbol} at $${price}`);
    }
  } catch (error) {
    logger.error(`Error selling stock ${symbol}: ${(error as Error).message}`);
    throw error instanceof TradingBotError
      ? error
      : new TradingBotError(
          `Error selling stock ${symbol}: ${(error as Error).message}`
        );
  }
};

/**
 * Generates a profit/loss report based on current holdings, prices and initial budget.
 * @returns An object containing the current balance, holdings and profit/loss figure.
 * @throws TradingBotError if report generation logic fails.
 */
export const getProfitLossReport = () => {
  try {
    const holdings = getHoldings();
    const marketValue = Object.keys(holdings).reduce((sum, symbol) => {
      const price = getStockPrice(symbol);
      return sum + holdings[symbol] * (price ?? 0);
    }, 0);
    const totalValue = balance + marketValue;
    const profitLoss = totalValue - TRADING_BOT_CONFIG.initialBalance;
    logger.info(`Generating profit/loss report: ${JSON.stringify({ balance, holdings, profitLoss })}`);
    return {
      balance,
      holdings,
      profitLoss,
    };
  } catch (error) {
    logger.error(`Error generating profit/loss report: ${(error as Error).message}`);
    throw error instanceof TradingBotError
      ? error
      : new TradingBotError(
          `Error generating profit/loss report: ${
            (error as Error).message
          }`
        );
  }
};

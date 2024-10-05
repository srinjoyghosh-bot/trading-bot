import {
  getStockPrices,
  logTrade,
  getAllTrades,
  getHoldings,
  updateHoldings,
} from "./dataService";
import { Trade } from "../models/trade";
import { TRADING_BOT_CONFIG } from "../../config/config";
import { TradingBotError } from "../utils/tradingBotError";
import logger from "../utils/logger";
import { calculateMovingAverage } from "../utils/movingAverage";

let balance = TRADING_BOT_CONFIG.initialBalance;

/**
 * Executes trades based on moving average crossover strategy.
 * @throws TradingBotError if any part of the trade execution logic fails.
 */
export const executeTrades = async () => {
  logger.info('Executing trades based on moving averages');
  try {
    const holdings = getHoldings();
    const symbols = TRADING_BOT_CONFIG.stocks;

    symbols.forEach((symbol) => {
      const prices = getStockPrices(symbol);
      if (prices === undefined) {
        logger.warn(`No historical prices found for symbol ${symbol}`);
        throw new TradingBotError(`No historical price found for symbol ${symbol}`);
      }
      const shortTermMA = calculateMovingAverage(prices, TRADING_BOT_CONFIG.movingAveragePeriods.shortTerm); 
      const longTermMA = calculateMovingAverage(prices, TRADING_BOT_CONFIG.movingAveragePeriods.longTerm);

      logger.debug(`Short term MA for symbol: ${symbol} is ${shortTermMA}`)
      logger.debug(`Long term ma for symbol: ${symbol} is ${longTermMA}`)

      if (!isNaN(shortTermMA) && !isNaN(longTermMA)) {
        const lastTrades = getAllTrades();
        lastTrades.reverse();
        const lastTrade = lastTrades.find(trade => trade.symbol === symbol);
        
        if (shortTermMA > longTermMA) {
          // Bullish crossover - Buy
          logger.debug(`Attempting to buy for symbol: ${symbol}`)
          if (!lastTrade || lastTrade.type === 'sell') {
            buy(symbol, prices[0].price, holdings);
          }
        } else if (shortTermMA < longTermMA) {
          // Bearish crossover - Sell
          logger.debug(`Attempting to sell for symbol: ${symbol}`)
          if (lastTrade && lastTrade.type === 'buy') {
            sell(symbol, prices[0].price, holdings);
          }
        }
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
 * Finds the most current or given timestamp price for a stock.
 * @param symbol The stock symbol.
 * @param timestamp The timestamp of the trade.
 * @returns The price at the given date or the most current price.
 */
function getPriceAtDate(symbol: string, timestamp: string): number {
    const prices = getStockPrices(symbol);
    if (prices) {
      // Find the price closest to the trade's timestamp
      prices.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const closestPrice = prices.reduce((prev, curr) => {
        return Math.abs(new Date(curr.timestamp).getTime() - new Date(timestamp).getTime()) <
               Math.abs(new Date(prev.timestamp).getTime() - new Date(timestamp).getTime())
               ? curr : prev;
      });
      return closestPrice.price;
    }
    return 0;
  }

/**
 * Generates a profit and loss report based on all trades and current stock prices.
 * Utilizes logging to record key operations and catches potential errors.
 * 
 * @returns The profit and loss report, or an error message if operation fails.
 * @throws TradingBotError if report generation logic fails.
 */
export const getProfitLossReport = () => {
    logger.info('Generating profit and loss report');
    try {
        const trades: Trade[] = getAllTrades();
        let totalProfitOrLoss = 0;
      
        const reportLines = trades.map(trade => {
          const tradePrice = trade.price;
          const currentPrice = getPriceAtDate(trade.symbol, new Date(trade.timestamp).toDateString());
          let profitOrLoss = 0;
      
          if (trade.type === 'buy') {
            profitOrLoss = (currentPrice - tradePrice) * trade.quantity;
          } else if (trade.type === 'sell') {
            profitOrLoss = (tradePrice - currentPrice) * trade.quantity;
          }
      
          totalProfitOrLoss += profitOrLoss; 
          logger.debug(`Processed trade: ${trade.timestamp} | ${trade.symbol} | ${trade.type} | Quantity: ${trade.quantity} | ` +
            `Trade Price: $${tradePrice.toFixed(2)} | Current Price: $${currentPrice.toFixed(2)} | ` +
            `Profit/Loss: $${profitOrLoss.toFixed(2)}`);
          return  {
            ...trade,
            currentPrice: currentPrice,
            profitLoss: profitOrLoss,
          };
        });

        logger.info('Profit and loss report generated successfully');

        return {
            totalProfitLoss: totalProfitOrLoss,
            trades: reportLines,
        };
    } catch (error) {
        console.error(error)
        logger.error(`Error generating profit and loss report: ${(error as Error).message}`);
        throw error instanceof TradingBotError ? error :  new TradingBotError(`Failed to generate profit and loss report: ${(error as Error).message}`);
    }
};

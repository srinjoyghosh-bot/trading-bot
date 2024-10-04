import { getStockPrice, logTrade, getAllTrades, getHoldings, updateHoldings } from './dataService';
import { Trade } from '../models/trade';
import { TRADING_BOT_CONFIG } from '../../config/config';

let balance = TRADING_BOT_CONFIG.initialBalance;

export async function executeTrades() {
  const holdings = getHoldings();
  const symbols = TRADING_BOT_CONFIG.stocks;

  symbols.forEach(symbol  => {
    const currentPrice = getStockPrice(symbol);
    const lastTrades = getAllTrades();
    lastTrades.reverse();
    const lastTrade = lastTrades.find(trade => trade.symbol === symbol);

    if (currentPrice !== undefined) {
      if (lastTrade) {
        const priceChange = (currentPrice - lastTrade.price) / lastTrade.price;

        if (lastTrade.type === 'buy' && priceChange >= TRADING_BOT_CONFIG.tradeRules.sellThreshold) {
          sell(symbol, currentPrice, holdings);
        } else if (lastTrade.type === 'sell' && priceChange <= TRADING_BOT_CONFIG.tradeRules.buyThreshold) {
          buy(symbol, currentPrice, holdings);
        }
      } else {
        // First trade action for this symbol; attempt to buy if no holdings exist
        buy(symbol, currentPrice, holdings);
      }
    }
  });
}

function buy(symbol: string, price: number, holdings: { [key: string]: number }) {
    console.log("buying");
    
  const quantity = Math.floor(balance / price);
  if (quantity > 0) {
    balance -= quantity * price;
    const currentQuantity = holdings[symbol] || 0;
    updateHoldings(symbol, currentQuantity + quantity);
    const trade: Trade = { type: 'buy', price, quantity, symbol, timestamp: new Date() };
    logTrade(trade);
    console.log(`Bought ${quantity} shares of ${symbol} at $${price}`);
  }
}

function sell(symbol: string, price: number, holdings: { [key: string]: number }) {
  const holding = holdings[symbol] || 0;
  if (holding > 0) {
    balance += holding * price;
    updateHoldings(symbol, 0);
    const trade: Trade = { type: 'sell', price, quantity: holding, symbol, timestamp: new Date() };
    logTrade(trade);
    console.log(`Sold ${holding} shares of ${symbol} at $${price}`);
  }
}

export function getProfitLossReport() {
  const holdings = getHoldings();
  const marketValue = Object.keys(holdings).reduce((sum, symbol) => {
    const price = getStockPrice(symbol);
    return sum + (holdings[symbol] * (price ?? 0));
  }, 0);
  const totalValue = balance + marketValue;
  const profitLoss = totalValue - TRADING_BOT_CONFIG.initialBalance;
  return {
    balance,
    holdings,
    profitLoss
  };
}

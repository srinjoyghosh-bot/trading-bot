# Automated Trading Bot

This project implements an automated trading bot using Node.js and TypeScript. The bot simulates trades based on the moving average crossover strategy and generates a profit/loss report in JSON format.

## Features

- Simulates trading using the moving average crossover strategy.
- Generates a profit/loss report in JSON format.

## Trading Logic

### Moving Average Crossover Strategy

The trading bot executes trades based on the moving average crossover strategy, which involves the following:

1. **Short-Term Moving Average (SMA)**: This is the average price of a stock over a short period (e.g., 10 days).
2. **Long-Term Moving Average (LMA)**: This is the average price over a longer period (e.g., 30 days).

### Trading Signals
- **Buy Signal**: When the short-term moving average crosses above the long-term moving average, the bot will execute a buy trade.
- **Sell Signal**: When the short-term moving average crosses below the long-term moving average, the bot will execute a sell trade.

This strategy aims to capitalize on price trends by identifying potential entry and exit points.

## Running the Application

Follow these steps to set up and run the trading bot application:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/srinjoyghosh-bot/trading-bot.git
2. **Install dependencies:**
    ```bash
    cd trading-bot
    npm install
3. **Prepare Data** \
   Update the `data/prices.json` file with your historical stock price data. The project includes mock data, so replace it with real data relevant to your application.
4. **Run the application:**
     ```bash
     npm start

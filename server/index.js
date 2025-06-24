const express = require('express');
const cors = require('cors');
const axios = require('axios');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Stock symbols and data storage
const POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];
let stockData = {};
let portfolios = {};
let marketNews = [];

// Initialize stock data
const initializeStockData = () => {
  POPULAR_STOCKS.forEach(symbol => {
    stockData[symbol] = {
      symbol,
      name: getCompanyName(symbol),
      price: getRandomPrice(symbol),
      change: 0,
      changePercent: 0,
      volume: `${(Math.random() * 50 + 20).toFixed(1)}M`,
      high: 0,
      low: 0,
      open: 0,
      chartData: generateInitialChartData()
    };
    
    // Set high, low, open based on current price
    stockData[symbol].open = stockData[symbol].price * (0.98 + Math.random() * 0.04);
    stockData[symbol].high = stockData[symbol].price * (1.0 + Math.random() * 0.03);
    stockData[symbol].low = stockData[symbol].price * (0.97 + Math.random() * 0.02);
    stockData[symbol].change = stockData[symbol].price - stockData[symbol].open;
    stockData[symbol].changePercent = (stockData[symbol].change / stockData[symbol].open) * 100;
  });
};

const getCompanyName = (symbol) => {
  const names = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corp.',
    'GOOGL': 'Alphabet Inc.',
    'TSLA': 'Tesla Inc.',
    'AMZN': 'Amazon.com Inc.',
    'NVDA': 'NVIDIA Corp.',
    'META': 'Meta Platforms Inc.',
    'NFLX': 'Netflix Inc.'
  };
  return names[symbol] || `${symbol} Inc.`;
};

const getRandomPrice = (symbol) => {
  const basePrices = {
    'AAPL': 185, 'MSFT': 340, 'GOOGL': 138, 'TSLA': 250,
    'AMZN': 145, 'NVDA': 750, 'META': 320, 'NFLX': 450
  };
  return basePrices[symbol] || 100;
};

const generateInitialChartData = () => {
  const data = [];
  let basePrice = 185;
  const now = new Date();
  
  for (let i = 0; i < 26; i++) {
    const time = new Date(now);
    time.setHours(9, 30 + (i * 15), 0);
    
    basePrice += (Math.random() - 0.5) * 2;
    
    data.push({
      time: time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      price: parseFloat(basePrice.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 500000
    });
  }
  return data;
};

// Generate market news
const generateMarketNews = () => {
  const newsTemplates = [
    { 
      headline: "Tech Stocks Rally on AI Optimism",
      summary: "Major technology companies see gains as artificial intelligence investments drive market confidence.",
      symbol: "TECH",
      sentiment: "positive",
      timestamp: new Date()
    },
    {
      headline: "Federal Reserve Signals Potential Rate Changes",
      summary: "Markets react to latest Federal Reserve meeting minutes suggesting monetary policy adjustments.",
      symbol: "MARKET",
      sentiment: "neutral",
      timestamp: new Date()
    },
    {
      headline: "Energy Sector Shows Strong Performance",
      summary: "Oil and gas companies lead market gains amid global energy demand recovery.",
      symbol: "ENERGY",
      sentiment: "positive",
      timestamp: new Date()
    },
    {
      headline: "Quarterly Earnings Beat Expectations",
      summary: "Several major corporations report better-than-expected quarterly results.",
      symbol: "EARNINGS",
      sentiment: "positive",
      timestamp: new Date()
    }
  ];
  
  return newsTemplates.map((news, index) => ({
    ...news,
    id: `news_${Date.now()}_${index}`,
    timestamp: new Date(Date.now() - Math.random() * 3600000) // Random time within last hour
  }));
};

// Update stock prices in real-time
const updateStockPrices = () => {
  POPULAR_STOCKS.forEach(symbol => {
    const stock = stockData[symbol];
    const change = (Math.random() - 0.5) * 2; // Random price movement
    const newPrice = Math.max(0.01, stock.price + change);
    
    // Update price data
    stock.price = parseFloat(newPrice.toFixed(2));
    stock.change = stock.price - stock.open;
    stock.changePercent = parseFloat(((stock.change / stock.open) * 100).toFixed(2));
    
    // Update high/low
    if (stock.price > stock.high) stock.high = stock.price;
    if (stock.price < stock.low) stock.low = stock.price;
    
    // Add new chart data point (simulate real trading hours)
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    // Keep only last 26 data points (6.5 hour trading day)
    if (stock.chartData.length >= 26) {
      stock.chartData.shift();
    }
    
    stock.chartData.push({
      time: timeString,
      price: stock.price,
      volume: Math.floor(Math.random() * 1000000) + 500000
    });
  });
  
  // Emit real-time updates to all connected clients
  io.emit('stockUpdate', {
    stocks: Object.values(stockData),
    timestamp: new Date().toISOString()
  });
};

// Initialize data
initializeStockData();
marketNews = generateMarketNews();

// Start real-time price updates
setInterval(updateStockPrices, 2000); // Update every 2 seconds

// Update news every 5 minutes
setInterval(() => {
  marketNews = generateMarketNews();
  io.emit('newsUpdate', marketNews);
}, 300000);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  // Send initial data to new client
  socket.emit('stockUpdate', {
    stocks: Object.values(stockData),
    timestamp: new Date().toISOString()
  });
  
  socket.emit('newsUpdate', marketNews);
  
  // Handle portfolio creation
  socket.on('createPortfolio', (userId) => {
    if (!portfolios[userId]) {
      portfolios[userId] = {
        userId,
        cash: 100000, // Starting with $100k
        positions: {},
        transactions: [],
        totalValue: 100000,
        totalGainLoss: 0,
        totalGainLossPercent: 0
      };
    }
    socket.emit('portfolioUpdate', portfolios[userId]);
  });
  
  // Handle buy order
  socket.on('buyStock', (data) => {
    const { userId, symbol, quantity } = data;
    const stock = stockData[symbol];
    const portfolio = portfolios[userId];
    
    if (!stock || !portfolio) return;
    
    const totalCost = stock.price * quantity;
    
    if (portfolio.cash >= totalCost) {
      // Execute buy order
      portfolio.cash -= totalCost;
      
      if (!portfolio.positions[symbol]) {
        portfolio.positions[symbol] = {
          symbol,
          quantity: 0,
          averagePrice: 0,
          totalCost: 0
        };
      }
      
      const position = portfolio.positions[symbol];
      const newTotalCost = position.totalCost + totalCost;
      const newQuantity = position.quantity + quantity;
      
      position.averagePrice = newTotalCost / newQuantity;
      position.quantity = newQuantity;
      position.totalCost = newTotalCost;
      
      // Add transaction
      portfolio.transactions.push({
        id: `txn_${Date.now()}`,
        type: 'BUY',
        symbol,
        quantity,
        price: stock.price,
        total: totalCost,
        timestamp: new Date()
      });
      
      // Update portfolio totals
      updatePortfolioTotals(portfolio);
      
      socket.emit('portfolioUpdate', portfolio);
      socket.emit('tradeConfirmation', {
        success: true,
        message: `Successfully bought ${quantity} shares of ${symbol} at $${stock.price}`,
        transaction: portfolio.transactions[portfolio.transactions.length - 1]
      });
    } else {
      socket.emit('tradeConfirmation', {
        success: false,
        message: 'Insufficient funds for this purchase'
      });
    }
  });
  
  // Handle sell order
  socket.on('sellStock', (data) => {
    const { userId, symbol, quantity } = data;
    const stock = stockData[symbol];
    const portfolio = portfolios[userId];
    const position = portfolio?.positions[symbol];
    
    if (!stock || !portfolio || !position || position.quantity < quantity) {
      socket.emit('tradeConfirmation', {
        success: false,
        message: 'Insufficient shares to sell'
      });
      return;
    }
    
    const totalValue = stock.price * quantity;
    
    // Execute sell order
    portfolio.cash += totalValue;
    position.quantity -= quantity;
    position.totalCost -= position.averagePrice * quantity;
    
    // Remove position if quantity is 0
    if (position.quantity === 0) {
      delete portfolio.positions[symbol];
    }
    
    // Add transaction
    portfolio.transactions.push({
      id: `txn_${Date.now()}`,
      type: 'SELL',
      symbol,
      quantity,
      price: stock.price,
      total: totalValue,
      timestamp: new Date()
    });
    
    // Update portfolio totals
    updatePortfolioTotals(portfolio);
    
    socket.emit('portfolioUpdate', portfolio);
    socket.emit('tradeConfirmation', {
      success: true,
      message: `Successfully sold ${quantity} shares of ${symbol} at $${stock.price}`,
      transaction: portfolio.transactions[portfolio.transactions.length - 1]
    });
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

const updatePortfolioTotals = (portfolio) => {
  let positionsValue = 0;
  
  Object.values(portfolio.positions).forEach(position => {
    const currentStock = stockData[position.symbol];
    if (currentStock) {
      positionsValue += currentStock.price * position.quantity;
    }
  });
  
  portfolio.totalValue = portfolio.cash + positionsValue;
  portfolio.totalGainLoss = portfolio.totalValue - 100000; // Initial $100k
  portfolio.totalGainLossPercent = (portfolio.totalGainLoss / 100000) * 100;
};

// REST API Routes (existing endpoints)
app.get('/api/stocks', (req, res) => {
  res.json({
    success: true,
    data: Object.values(stockData),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/stock/:symbol', (req, res) => {
  const { symbol } = req.params;
  const stock = stockData[symbol.toUpperCase()];
  
  if (!stock) {
    return res.status(404).json({
      success: false,
      error: 'Stock not found'
    });
  }
  
  res.json({
    success: true,
    data: {
      ...stock,
      volume: stock.chartData.reduce((sum, d) => sum + d.volume, 0)
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/indices', (req, res) => {
  const indices = [
    {
      name: 'DOW JONES',
      value: 34567.89 + (Math.random() - 0.5) * 200,
      change: (Math.random() - 0.5) * 100,
      changePercent: (Math.random() - 0.5) * 1.5
    },
    {
      name: 'S&P 500',
      value: 4456.78 + (Math.random() - 0.5) * 50,
      change: (Math.random() - 0.5) * 30,
      changePercent: (Math.random() - 0.5) * 1.2
    },
    {
      name: 'NASDAQ',
      value: 13789.45 + (Math.random() - 0.5) * 150,
      change: (Math.random() - 0.5) * 80,
      changePercent: (Math.random() - 0.5) * 1.8
    }
  ];

  const indicesWithCalculations = indices.map(index => ({
    ...index,
    value: parseFloat(index.value.toFixed(2)),
    change: parseFloat(index.change.toFixed(2)),
    changePercent: parseFloat(index.changePercent.toFixed(2))
  }));

  res.json({
    success: true,
    data: indicesWithCalculations,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/news', (req, res) => {
  res.json({
    success: true,
    data: marketNews,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/portfolio/:userId', (req, res) => {
  const { userId } = req.params;
  const portfolio = portfolios[userId];
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }
  
  res.json({
    success: true,
    data: portfolio,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'StockNova API is running with real-time capabilities!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    connectedClients: io.engine.clientsCount
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 StockNova Enhanced API Server running on port ${PORT}`);
  console.log(`⚡ WebSocket support enabled`);
  console.log(`📊 Real-time updates every 2 seconds`);
  console.log(`💼 Portfolio management enabled`);
  console.log(`📰 News feed integration ready`);
  console.log(`💸 Trading simulator active`);
  console.log(`\n📈 Features available:`);
  console.log(`   🔴 LIVE - Real-time stock prices`);
  console.log(`   💰 LIVE - Portfolio management`);
  console.log(`   📺 LIVE - News feed`);
  console.log(`   🎮 LIVE - Trading simulator`);
});

module.exports = { app, server };
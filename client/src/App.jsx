import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Activity,
  Star,
  Search,
  Bell,
  Settings,
  Plus,
  RefreshCw,
  X,
  Volume2,
  Target,
  Zap,
  Brain,
  AlertTriangle,
  Newspaper,
  Flame,
  Rocket,
  Bitcoin,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Send
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart
} from 'recharts';
import './App.css';

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  // const [currentTime, setCurrentTime] = useState(new Date());
  const [stocks, setStocks] = useState([]);
  const [indices, setIndices] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [loading, setLoading] = useState(true);
  const [showEnhancedChart, setShowEnhancedChart] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [activeTab, setActiveTab] = useState('stocks');
  const [aiMessages, setAiMessages] = useState([
    {
      type: 'ai',
      content: 'Welcome to AI Trading Assistant! I see TSLA is trending. Would you like me to analyze the options flow?'
    },
    {
      type: 'ai',
      content: 'Based on technical indicators, TSLA shows bullish momentum. Consider the $350 call options expiring next week.'
    }
  ]);
  const [aiInput, setAiInput] = useState('');

  const stockData = [
    { 
      symbol: 'TSLA', 
      name: 'Tesla Inc', 
      price: 347.85, 
      change: 15.67, 
      changePercent: 4.72, 
      volume: '89.2M',
      aiScore: 85,
      sentiment: 'bullish',
      optionsFlow: 'heavy_calls',
      newsCount: 23
    },
    { 
      symbol: 'AAPL', 
      name: 'Apple Inc', 
      price: 189.42, 
      change: -2.31, 
      changePercent: -1.21, 
      volume: '67.8M',
      aiScore: 72,
      sentiment: 'neutral',
      optionsFlow: 'mixed',
      newsCount: 18
    },
    { 
      symbol: 'NVDA', 
      name: 'NVIDIA Corp', 
      price: 891.32, 
      change: 34.21, 
      changePercent: 3.99, 
      volume: '45.6M',
      aiScore: 94,
      sentiment: 'very_bullish',
      optionsFlow: 'extreme_calls',
      newsCount: 31
    },
    { 
      symbol: 'MSFT', 
      name: 'Microsoft Corp', 
      price: 378.91, 
      change: -5.43, 
      changePercent: -1.41, 
      volume: '34.2M',
      aiScore: 68,
      sentiment: 'bearish',
      optionsFlow: 'heavy_puts',
      newsCount: 12
    }
  ];

  const cryptoData = [
    { symbol: 'BTC', name: 'Bitcoin', price: 67432.18, change: 2341.67, changePercent: 3.6 },
    { symbol: 'ETH', name: 'Ethereum', price: 3892.45, change: -123.45, changePercent: -3.1 },
    { symbol: 'SOL', name: 'Solana', price: 198.76, change: 15.32, changePercent: 8.3 }
  ];

  const newsData = [
    {
      headline: "Tesla FSD Beta Shows 40 Percent Improvement in Safety Metrics",
      source: "TechCrunch",
      time: "2 min ago",
      sentiment: "bullish",
      impact: "high",
      stocks: ["TSLA"]
    },
    {
      headline: "NVIDIA Announces Next-Gen AI Chips for Autonomous Vehicles",
      source: "Reuters",
      time: "15 min ago",
      sentiment: "very_bullish",
      impact: "high",
      stocks: ["NVDA", "TSLA"]
    },
    {
      headline: "Apple iPhone Sales Down 12 Percent in China",
      source: "WSJ",
      time: "1 hr ago",
      sentiment: "bearish",
      impact: "medium",
      stocks: ["AAPL"]
    }
  ];

  const fetchStocks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stocks`);
      if (response.data.success) {
        setStocks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setStocks(stockData);
    }
  };

  const fetchIndices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/indices`);
      if (response.data.success) {
        setIndices(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching indices:', error);
    }
  };

  const fetchChartData = async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stock/${symbol}`);
      if (response.data.success) {
        setChartData(response.data.data.chartData);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      const mockData = Array.from({length: 50}, (_, i) => ({
        time: `${i}:00`,
        price: 347.85 + (Math.random() - 0.5) * 20,
        volume: Math.random() * 1000000
      }));
      setChartData(mockData);
    }
  };

  const handleStockSelect = (symbol) => {
    setSelectedStock(symbol);
    setShowEnhancedChart(true);
    fetchChartData(symbol);
  };

  const handleAiSend = () => {
    if (aiInput.trim()) {
      setAiMessages([...aiMessages, { type: 'user', content: aiInput }]);
      // Simulate AI response
      setTimeout(() => {
        setAiMessages(prev => [...prev, {
          type: 'ai',
          content: `Analyzing "${aiInput}"... Based on current market conditions, I recommend monitoring the RSI levels for oversold conditions.`
        }]);
      }, 10000);
      setAiInput('');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStocks(),
        fetchIndices(),
        fetchChartData(selectedStock)
      ]);
      setLoading(false);
    };
    loadData();
  }, [selectedStock]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStocks();
      fetchIndices();
      if (selectedStock) {
        fetchChartData(selectedStock);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [selectedStock]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 100000);
    return () => clearInterval(timer);
  }, []);

  const MarketOverview = () => {
    const portfolioValue = 127834.56;
    const portfolioChange = 3456.78;
    const portfolioPercent = (portfolioChange / portfolioValue) * 100;

    return (
      <div className="market-overview">
        <h2 className="section-title">Market Overview</h2>
        <div className="overview-cards">
          <div className="overview-card">
            <div className="card-icon dow"><BarChart3 /></div>
            <div className="card-content">
              <h3>DOW JONES</h3>
              <p className="index-value">34,611.16</p>
              <span className="index-change positive">+84.69 (+0.24%)</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon sp500"><TrendingUp /></div>
            <div className="card-content">
              <h3>S&P 500</h3>
              <p className="index-value">4,474.79</p>
              <span className="index-change positive">+9.19 (+0.21%)</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon nasdaq"><Activity /></div>
            <div className="card-content">
              <h3>NASDAQ</h3>
              <p className="index-value">13,821.81</p>
              <span className="index-change negative">-24.56 (-0.18%)</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon portfolio">
              <PieChart />
            </div>
            <div className="card-content">
              <h3>YOUR PORTFOLIO</h3>
              <p className="index-value">${portfolioValue.toLocaleString()}</p>
              <span className="index-change positive">
                +${portfolioChange.toFixed(2)} (+{portfolioPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NuclearStockCard = ({ stock }) => {
    const getSentimentColor = (sentiment) => {
      switch(sentiment) {
        case 'very_bullish': return '#00ff88';
        case 'bullish': return '#66ff99';
        case 'neutral': return '#ffcc00';
        case 'bearish': return '#ff6666';
        default: return '#888';
      }
    };

    return (
      <div 
        className={`nuclear-stock-card ${selectedStock === stock.symbol && showEnhancedChart ? 'selected' : ''}`}
        onClick={() => handleStockSelect(stock.symbol)}
      >
        <div className="stock-header">
          <div>
            <h3 className="stock-symbol">{stock.symbol}</h3>
            <p className="stock-name">{stock.name}</p>
          </div>
          <div className="ai-score">
            <Brain className="ai-icon" />
            <span>{stock.aiScore || 75}</span>
          </div>
        </div>
        
        <div className="stock-price">
          <span className="price">${stock.price.toFixed(2)}</span>
          <div className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
            {stock.change >= 0 ? <TrendingUp /> : <TrendingDown />}
            <span>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent}%)</span>
          </div>
        </div>
        
        <div className="stock-indicators">
          <div className="sentiment" style={{ color: getSentimentColor(stock.sentiment) }}>
            <Flame className="sentiment-icon" />
            {stock.sentiment ? stock.sentiment.replace('_', ' ').toUpperCase() : 'NEUTRAL'}
          </div>
          <div className="options-flow">
            <Target className="options-icon" />
            {stock.optionsFlow ? stock.optionsFlow.replace('_', ' ') : 'mixed'}
          </div>
          <div className="news-count">
            <Newspaper className="news-icon" />
            {stock.newsCount || 0} articles
          </div>
        </div>
        
        <div className="nuclear-actions">
          <button className="quick-buy">Quick Buy</button>
          <button className="view-options">Options</button>
        </div>
      </div>
    );
  };

  const AIAssistant = () => (
    <div className="ai-assistant-panel">
      <div className="ai-header">
        <div className="ai-title">
          <Brain className="ai-brain-icon" />
          AI Trading Assistant
          <div className="ai-status">ACTIVE</div>
        </div>
        <button onClick={() => setShowAIAssistant(false)} className="close-ai-btn">
          <X />
        </button>
      </div>
      
      <div className="ai-messages">
        {aiMessages.map((msg, index) => (
          <div key={index} className={`ai-message ${msg.type} new`}>
            <div className="msg-icon">
              <Brain />
            </div>
            <div className="msg-content">{msg.content}</div>
          </div>
        ))}
      </div>
      
      <div className="ai-suggestions">
        <h4>AI Recommendations</h4>
        <div className="suggestion-card">
          <div className="suggestion-header">
            <Rocket className="suggestion-icon" />
            <span>High Conviction Play</span>
          </div>
          <div className="suggestion-text">
            NVDA $900 calls expiring Friday showing unusual volume. 
            Probability of profit: 73%
          </div>
          <button className="execute-suggestion">Execute Trade</button>
        </div>
      </div>
      
      <div className="ai-input">
        <input 
          type="text" 
          placeholder="Ask AI anything about the market..."
          className="ai-chat-input"
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAiSend()}
        />
        <button className="send-ai-btn" onClick={handleAiSend}>
          <Send />
        </button>
      </div>
    </div>
  );

  const NewsPanel = () => (
    <div className="news-panel-enhanced">
      <div className="news-header">
        <h3>
          <Newspaper className="news-icon" />
          Live Market News
        </h3>
        <div className="news-sentiment-overview">
          <div className="sentiment-bullish">68% Bullish</div>
          <div className="sentiment-bearish">32% Bearish</div>
        </div>
      </div>
      
      <div className="news-feed">
        {newsData.map((news, i) => (
          <div key={i} className={`news-item ${news.sentiment}`}>
            <div className="news-content">
              <div className="news-headline">{news.headline}</div>
              <div className="news-meta">
                <span className="news-source">{news.source}</span>
                <span className="news-time">
                  <Clock className="time-icon" />
                  {news.time}
                </span>
                <span className={`news-impact ${news.impact}`}>
                  {news.impact.toUpperCase()} IMPACT
                </span>
              </div>
              <div className="affected-stocks">
                {news.stocks.map(stock => (
                  <span key={stock} className="stock-tag">{stock}</span>
                ))}
              </div>
            </div>
            <div className={`sentiment-indicator ${news.sentiment}`}>
              {news.sentiment === 'bullish' || news.sentiment === 'very_bullish' ? 
                <ThumbsUp /> : <ThumbsDown />
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CryptoPanel = () => (
    <div className="crypto-panel">
      <div className="crypto-header">
        <h3>
          <Bitcoin className="crypto-icon" />
          Crypto Markets
        </h3>
        <div className="crypto-fear-greed">
          Fear & Greed: <span className="greed">76 (Greed)</span>
        </div>
      </div>
      
      <div className="crypto-list">
        {cryptoData.map((crypto, i) => (
          <div key={i} className="crypto-item">
            <div className="crypto-info">
              <div className="crypto-symbol">{crypto.symbol}</div>
              <div className="crypto-name">{crypto.name}</div>
            </div>
            <div className="crypto-price-info">
              <div className="crypto-price">${crypto.price.toLocaleString()}</div>
              <div className={`crypto-change ${crypto.change > 0 ? 'positive' : 'negative'}`}>
                {crypto.change > 0 ? '+' : ''}{crypto.change.toFixed(2)} ({crypto.changePercent}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EnhancedPriceChart = ({ selectedStock, stocks, chartData, onClose }) => {
    const stock = stocks.find(s => s.symbol === selectedStock) || stockData.find(s => s.symbol === selectedStock);
    
    if (!stock) return null;

    return (
      <div className="nuclear-chart-panel">
        <div className="chart-header nuclear">
          <div className="stock-info nuclear">
            <h2>{stock.symbol}</h2>
            <div className="nuclear-price">${stock.price}</div>
            <div className="ai-analysis">
              AI Confidence: {stock.aiScore || 75}%
            </div>
          </div>
          <button onClick={onClose} className="close-nuclear">
            <X />
          </button>
        </div>
        
        <div className="nuclear-chart-area">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis yAxisId="price" stroke="#888" />
              <YAxis yAxisId="volume" orientation="right" stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(26, 26, 46, 0.95)', 
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: '8px'
                }}
              />
              <Area 
                yAxisId="price" 
                type="monotone" 
                dataKey="price" 
                fill="url(#nuclearGradient)" 
                stroke="#00ff88" 
                strokeWidth={2}
              />
              <Bar 
                yAxisId="volume" 
                dataKey="volume" 
                fill="#666" 
                opacity={0.3} 
              />
              <defs>
                <linearGradient id="nuclearGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="nuclear-stocknova">
      <header className="nuclear-header">
        <div className="header-left">
          <div className="nuclear-logo">
            <div className="logo-icon nuclear">
              <Activity className="nova-icon pulsing" />
            </div>
            <div className="logo-text">
              <h1>StockNova</h1>
              <span>NUCLEAR EDITION</span>
            </div>
          </div>
        </div>
        
        <div className="header-center">
          <div className="search-container nuclear">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="AI-powered search..."
              className="search-input nuclear"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="ai-search-btn">
              <Brain />
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <div className="nuclear-stats">
            <div className="stat-item">
              <span className="stat-label">AI Score</span>
              <span className="stat-value nuclear">94/100</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Alerts</span>
              <span className="stat-value">3</span>
            </div>
          </div>
          
          <button 
            className="nuclear-btn ai-btn"
            onClick={() => setShowAIAssistant(!showAIAssistant)}
          >
            <Brain /> AI Assistant
          </button>
        </div>
      </header>

      <div className="nuclear-content">
        <MarketOverview />

        <div className="nuclear-tabs">
          <button 
            className={`tab ${activeTab === 'stocks' ? 'active' : ''}`}
            onClick={() => setActiveTab('stocks')}
          >
            Stocks
          </button>
          <button 
            className={`tab ${activeTab === 'crypto' ? 'active' : ''}`}
            onClick={() => setActiveTab('crypto')}
          >
            Crypto
          </button>
          <button 
            className={`tab ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            News
          </button>
        </div>

        <div className={`nuclear-main ${showEnhancedChart ? 'chart-open' : ''}`}>
          <div className="nuclear-left">
            {activeTab === 'stocks' && (
              <div className="stocks-section nuclear">
                <div className="section-header nuclear">
                  <h2>Nuclear Watchlist</h2>
                  <button className="nuclear-btn">
                    <Plus /> Add Stock
                  </button>
                </div>
                <div className="nuclear-stocks-grid">
                  {(stocks.length > 0 ? stocks : stockData).map((stock) => (
                    <NuclearStockCard key={stock.symbol} stock={stock} />
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'crypto' && <CryptoPanel />}
            {activeTab === 'news' && <NewsPanel />}
          </div>

          {showEnhancedChart && selectedStock && (
            <EnhancedPriceChart 
              selectedStock={selectedStock}
              stocks={stocks.length > 0 ? stocks : stockData}
              chartData={chartData}
              onClose={() => setShowEnhancedChart(false)}
            />
          )}
        </div>
      </div>

      {showAIAssistant && <AIAssistant />}
    </div>
  );
}

export default App;
StockNova Nuclear Edition (***SIMULATOR***)🚀
AI-Powered Financial Trading Platform with Real-Time Market Data
Show Image
Show Image
Show Image
Show Image
Overview
StockNova Nuclear Edition is a cutting-edge financial trading dashboard featuring real-time market data, AI-powered analytics, and a stunning nuclear-themed interface.
Built for traders who demand both performance and aesthetics.

Features:

✨ Real-Time Market Data - Live stock prices updated every 2 seconds via WebSocket

🤖 AI Trading Assistant - Interactive chat with market analysis and trade recommendations

📊 Advanced Charting - Interactive price/volume charts with nuclear gradient effects

📰 News Sentiment Analysis - Market news with bullish/bearish indicators

🎨 Nuclear Theme UI - Neon green accents, animations, and glassmorphism effects

📱 Responsive Design - Seamless experience across desktop and mobile devices

Quick Start:

Prerequisites

Node.js 16+
npm or yarn

Installation

Clone the repository

bashgit clone https://github.com/Nicktella/stocknova.git
cd stocknova

Install dependencies

bash# Install server dependencies
cd server && npm install

# Install client dependencies  
cd ../client && npm install

Run the application

bash# Terminal 1 - Start server (from server directory)
npm start

# Terminal 2 - Start client (from client directory)
npm run dev

Open your browser

http://localhost:5173
Tech Stack
Frontend

React 18 + Vite
Recharts for data visualization
Lucide React icons
CSS3 with custom animations

Backend

Node.js + Express
Socket.io for real-time updates
RESTful API

Project Structure
stocknova/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main application
│   │   ├── App.css        # Nuclear theme styles
│   │   └── main.jsx       # Entry point
│   └── package.json
├── server/                 # Express backend
│   ├── index.js           # Server & API routes
│   └── package.json
└── README.md
API Endpoints
EndpointMethodDescription/api/stocksGETGet all stock prices/api/stock/:symbolGETGet specific stock data/api/indicesGETGet market indices/api/newsGETGet market news
Configuration
Disable Animations (for better performance)
javascript// In App.jsx, set performanceMode to true
const [performanceMode, setPerformanceMode] = useState(true);
Change Update Frequency
javascript// In server/index.js
setInterval(updateStockPrices, 5000); // Change from 2000ms
Contributing

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit changes (git commit -m 'Add amazing feature')
Push to branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.
Contact
Nicktella - GitHub Profile
Project Link: https://github.com/Nicktella/stocknova

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // WebFlux 연결 상태
  const [isConnected, setIsConnected] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [responseTime, setResponseTime] = useState(0);

  // 주식 데이터 시뮬레이션
  const stockData = {
    samsung: {
      name: '삼성전자',
      basePrice: 75000,
      symbol: '₩'
    },
    apple: {
      name: '애플',
      basePrice: 180,
      symbol: '$'
    },
    tesla: {
      name: '테슬라',
      basePrice: 250,
      symbol: '$'
    }
  };

  const [currentStock, setCurrentStock] = useState(null);
  const [stockInfoData, setStockInfoData] = useState([]);

  // WebFlux 연결 핸들러
  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  // 랜덤 가격 생성
  const generateRandomPrice = (basePrice) => {
    const change = (Math.random() - 0.5) * 0.1; // ±5% 변동
    return Math.round(basePrice * (1 + change));
  };

  // 랜덤 거래량 생성
  const generateRandomVolume = () => {
    return Math.floor(Math.random() * 10000000) + 1000000;
  };

  // 가격 변화율 계산
  const calculateChange = (current, base) => {
    const change = current - base;
    const changePercent = (change / base) * 100;
    return {
      value: change,
      percent: changePercent
    };
  };

  // 주식 정보 아이템 생성
  const createStockInfoItem = () => {
    if (!currentStock) return null;

    const stock = stockData[currentStock];
    const price = generateRandomPrice(stock.basePrice);
    const volume = generateRandomVolume();
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const change = calculateChange(price, stock.basePrice);
    
    return {
      time: timeString,
      price: price,
      volume: volume,
      change: change
    };
  };

  // 주식 선택 핸들러
  const handleStockSelect = (stockKey) => {
    setCurrentStock(stockKey);
    setStockInfoData([]); // 정보 초기화
  };

  // 현재 선택된 주식 정보 계산
  const getCurrentStockInfo = () => {
    if (!currentStock) return null;

    const stock = stockData[currentStock];
    const currentPrice = generateRandomPrice(stock.basePrice);
    const change = calculateChange(currentPrice, stock.basePrice);
    
    return {
      name: stock.name,
      price: currentPrice,
      change: change,
      symbol: stock.symbol
    };
  };

  // WebFlux 데이터 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        setMessageCount(prev => prev + Math.floor(Math.random() * 10));
        setResponseTime(Math.floor(Math.random() * 100) + 10);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected]);

  // 주식 데이터 업데이트
  useEffect(() => {
    if (!currentStock) return;

    const interval = setInterval(() => {
      const newItem = createStockInfoItem();
      if (newItem) {
        setStockInfoData(prevData => {
          const updatedData = [newItem, ...prevData];
          // 최대 20개 아이템만 유지
          return updatedData.slice(0, 20);
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStock]);

  const currentStockInfo = getCurrentStockInfo();

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">WebFlux Dashboard</span>
          </div>
        </div>
        <div className="nav-status">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </nav>

      <main className="main-content">
        {/* WebFlux Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">
            Reactive Web Application
          </h1>
          <p className="hero-subtitle">
            Real-time data streaming with Spring WebFlux
          </p>
          <button 
            className={`connect-btn ${isConnected ? 'disconnect' : 'connect'}`}
            onClick={handleConnect}
          >
            {isConnected ? 'Disconnect' : 'Connect to Server'}
          </button>
        </div>

        {/* WebFlux Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <h3 className="metric-title">Messages Processed</h3>
              <p className="metric-value">{messageCount.toLocaleString()}</p>
              <p className="metric-change">+{Math.floor(Math.random() * 50)} last minute</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⚡</div>
            <div className="metric-content">
              <h3 className="metric-title">Response Time</h3>
              <p className="metric-value">{responseTime}ms</p>
              <p className="metric-change">Avg: {Math.floor(responseTime * 0.8)}ms</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🔄</div>
            <div className="metric-content">
              <h3 className="metric-title">Active Connections</h3>
              <p className="metric-value">{isConnected ? Math.floor(Math.random() * 100) + 50 : 0}</p>
              <p className="metric-change">Peak: {Math.floor(Math.random() * 200) + 100}</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <h3 className="metric-title">Throughput</h3>
              <p className="metric-value">{Math.floor(Math.random() * 1000) + 500} req/s</p>
              <p className="metric-change">+{Math.floor(Math.random() * 20)}% from yesterday</p>
            </div>
          </div>
        </div>

        {/* Stock Dashboard Section */}
        <div className="stock-dashboard-section">
          <div className="section-header">
            <h2 className="section-title">📈 Stock Dashboard</h2>
            <p className="section-subtitle">주식 종목을 선택하여 상세 정보를 확인하세요</p>
          </div>

          {/* Stock Selector */}
          <div className="stock-selector">
            <div className="stock-tabs">
              <button 
                className={`stock-tab ${currentStock === 'samsung' ? 'active' : ''}`}
                onClick={() => handleStockSelect('samsung')}
              >
                삼성전자
              </button>
              <button 
                className={`stock-tab ${currentStock === 'apple' ? 'active' : ''}`}
                onClick={() => handleStockSelect('apple')}
              >
                애플
              </button>
              <button 
                className={`stock-tab ${currentStock === 'tesla' ? 'active' : ''}`}
                onClick={() => handleStockSelect('tesla')}
              >
                테슬라
              </button>
            </div>
          </div>

          {/* Stock Info Section */}
          {currentStock && currentStockInfo && (
            <div className="stock-info-section">
              <div className="info-header">
                <div className="selected-stock-name">{currentStockInfo.name}</div>
                <div className="selected-stock-price">
                  {currentStockInfo.symbol}{currentStockInfo.price.toLocaleString()}
                </div>
                <div 
                  className="selected-stock-change"
                  style={{
                    color: currentStockInfo.change.percent > 0 ? '#10b981' : 
                           currentStockInfo.change.percent < 0 ? '#ef4444' : 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  {currentStockInfo.change.percent >= 0 ? '+' : ''}{currentStockInfo.change.percent.toFixed(1)}% 
                  ({currentStockInfo.change.value >= 0 ? '+' : ''}{currentStockInfo.symbol}{Math.abs(currentStockInfo.change.value).toLocaleString()})
                </div>
              </div>
              <div className="info-list">
                {stockInfoData.map((item, index) => {
                  const changeClass = item.change.percent > 0 ? 'change-positive' : 
                                    item.change.percent < 0 ? 'change-negative' : 'change-neutral';
                  
                  const changeText = `${item.change.percent >= 0 ? '+' : ''}${item.change.percent.toFixed(1)}%`;

                  return (
                    <div key={index} className="info-item">
                      <div className="info-content">
                        <div className="info-label">주가</div>
                        <div className="info-value">
                          {stockData[currentStock].symbol}{item.price.toLocaleString()}
                        </div>
                        <div className="info-time">{item.time}</div>
                      </div>
                      <div className="info-content">
                        <div className="info-label">거래량</div>
                        <div className="info-value">{item.volume.toLocaleString()}주</div>
                      </div>
                      <div className={`info-change ${changeClass}`}>
                        {changeText}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!currentStock && (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-text">주식 종목을 선택해주세요</div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Non-blocking I/O</h3>
              <p>Asynchronous processing for high performance</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📡</div>
              <h3>Reactive Streams</h3>
              <p>Backpressure handling and flow control</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Event-driven</h3>
              <p>Real-time event processing capabilities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Scalable</h3>
              <p>Efficient resource utilization</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

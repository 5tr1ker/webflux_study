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

  // WebSocket 연결 상태
  const [ws, setWs] = useState(null);

  // WebFlux 연결 핸들러
  const handleConnect = () => {
    if (isConnected) {
      // 연결 해제
      if (ws) {
        ws.close();
        setWs(null);
      }
      setIsConnected(false);
    } else {
      // 연결 시작
      try {
        // 프록시 서버를 통해 WebSocket 연결
        const websocket = new WebSocket('ws://localhost:3001');
        
        websocket.onopen = () => {
          console.log('WebSocket connected to proxy server');
          setIsConnected(true);
          setWs(websocket);
        };
        
        websocket.onmessage = (event) => {
          console.log('=== React Client Received Message ===');
          console.log('Raw event:', event);
          console.log('Event data:', event.data);
          console.log('Data type:', typeof event.data);
          console.log('Data length:', event.data ? event.data.length : 'undefined');
          console.log('=====================================');
          
          // 메시지 수 증가
          setMessageCount(prev => prev + 1);
          
          // JSON 파싱 시도
          try {
            const result = parseStockString(event.data);
            const newItem = {
              date : result.date,
              stock : result.stock,
              volume : result.trade_data[0].volume,
              price : result.trade_data[0].price,
              time : result.trade_data[0].time
            }
         
            setStockInfoData(prevData => {
              const updatedData = [newItem, ...prevData];

              return updatedData.slice(0, 20);
            });
            console.log('result : ' , result);
          } catch (error) {
            console.log('Data is not JSON format:', error.message);
          }
        };
        
        websocket.onclose = (event) => {
          console.log('WebSocket disconnected');
          console.log('Close event:', event);
          console.log('Close code:', event.code);
          console.log('Close reason:', event.reason);
          setIsConnected(false);
          setWs(null);
        };
        
        websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
          setWs(null);
        };
      } catch (error) {
        console.error('Failed to connect:', error);
        setIsConnected(false);
      }
    }
  };

function parseStockString(stockString) {
  const match = "{" + stockString.substring(6, stockString.length - 1) + "}";

  const jsonStr = match
  .replace(/=/g, ':')                     // = 를 : 로 변경
  .replace(/([{,]\s*)(\w+)(?=:)/g, '$1"$2"')  // 키에 쌍따옴표 추가
  .replace(/:([^,\[\{"][^,\]\}]+)/g, ': "$1"') // 값이 숫자나 객체/배열이 아닌 경우 문자열 처리
  .replace(/'/g, '"');                   // 작은 따옴표를 쌍따옴표로

  return JSON.parse(jsonStr);
}

  // 랜덤 가격 생성
  const generateRandomPrice = (basePrice) => {
    const change = (Math.random() - 0.5) * 0.1; // ±5% 변동
    return Math.round(basePrice * (1 + change));
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
              <p className="metric-value">{messageCount}</p>
              <p className="metric-change">+1 last minute</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⚡</div>
            <div className="metric-content">
              <h3 className="metric-title">Response Time</h3>
              <p className="metric-value">0 ms</p>
              <p className="metric-change">Avg: 0 ms</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🔄</div>
            <div className="metric-content">
              <h3 className="metric-title">Active Connections</h3>
              <p className="metric-value">{isConnected ? "Enabled" : "Disable"}</p>
              <p className="metric-change">Peak: unknown</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <h3 className="metric-title">Throughput</h3>
              <p className="metric-value">1 req/s</p>
              <p className="metric-change">+0% from yesterday</p>
            </div>
          </div>
        </div>

        {/* Stock Dashboard Section */}
        <div className="stock-dashboard-section">
          <div className="section-header">
            <h2 className="section-title"><span>📈</span> Stock Dashboard</h2>
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
              </div>
              <div className="info-list">
                {stockInfoData.map((item, index) => {

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
                      <div className={`info-change change-positive`}>
                        -
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

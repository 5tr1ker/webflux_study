const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const WebSocket = require('ws');
const { SourceTextModule } = require('vm');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 3001;

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // WebSocket 프록시 서버 생성
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    console.log('WebSocket connection established from:', req.url);
    
    // Spring Boot 서버의 /stock/connect 엔드포인트로 연결
    const springWs = new WebSocket('ws://localhost:8080/stock/connect');
    
    springWs.on('open', (message) => {
      console.log('Connected to Spring Boot WebSocket at /stock/connect');
      console.log(message);
      
      console.log('Initial data sent successfully!');
    });
    
    // 클라이언트 → Spring 서버
    ws.on('message', (message) => {
          console.log('Client → Spring:', message.toString());
        if (springWs.readyState === WebSocket.OPEN) {
          springWs.send(message);
          console.log("Client message forwarded to Spring!");
        }
    });
    
    // Spring 서버 → 클라이언트
    springWs.on('message', (message) => {
      console.log('Spring → Client:', message.toString());
      console.log('Message type:', typeof message);
      console.log('Message buffer:', message);
      
      if (ws.readyState === WebSocket.OPEN) {
        console.log('Forwarding message to client...');
        ws.send(message.toString());
        console.log('Message forwarded successfully');
      } else {
        console.log('Client WebSocket not open, cannot forward message');
      }
    });
    
    // 연결 종료 처리
    ws.on('close', () => {
      console.log('Client WebSocket closed');
      springWs.close();
    });
    
    springWs.on('close', () => {
      console.log('Spring WebSocket closed');
      ws.close();
    });
    
    // 에러 처리
    ws.on('error', (error) => {
      console.error('Client WebSocket error:', error);
      springWs.close();
    });
    
    springWs.on('error', (error) => {
      console.error('Spring WebSocket error:', error);
      ws.close();
    });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
    console.log(`📡 HTTP proxy: http://localhost:${PORT}/* → http://localhost:8080/*`);
    console.log(`🔌 WebSocket proxy: ws://localhost:${PORT} → ws://localhost:8080/stock/connect`);
  });
}); 
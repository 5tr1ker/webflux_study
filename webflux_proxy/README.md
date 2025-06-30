# WebFlux Proxy Server

단순한 프록시 서버 - React에서 Spring으로 요청 전달

## 🚀 실행

```bash
npm install
npm run dev
```

## 🔗 사용법

React에서 API 호출:

```javascript
fetch("http://localhost:3001/api/stock/test");
```

## 📡 프록시 규칙

- `http://localhost:3001/api/*` → `http://localhost:8080/*`

끝.

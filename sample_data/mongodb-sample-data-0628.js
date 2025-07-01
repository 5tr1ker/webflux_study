use stock;
// db.stock.drop(); // 기존 데이터 삭제

const stocks = ["삼성전자", "애플", "테슬라"];
const dateString = "2025-06-28";

function pad(n) {
  return n < 10 ? '0' + n : n;
}

function getRandomPrice() {
  return Math.floor(Math.random() * 2000 + 1000); // 1000~3000
}

function getRandomVolume() {
  return Math.floor(Math.random() * 500000 + 1000); // 1000~510000
}

for (let s = 0; s < stocks.length; s++) {
  const 거래정보 = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m++) {
      거래정보.push({
        "price": getRandomPrice(),
        "volume": getRandomVolume(),
        "time": `${pad(h)}:${pad(m)}`
      });
    }
  }

  db.stock.insertOne({
    "stock": stocks[s],
    "date": dateString,
    "trade_data": 거래정보
  });

  print(`${stocks[s]} 데이터 저장 완료`);
}

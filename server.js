const express = require('express');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 8080;

// ✅ MySQL 연결
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('❌ MySQL 연결 실패:', err);
  } else {
    console.log('✅ MySQL 연결 성공!');
  }
});

// ✅ React 정적 파일 서빙
app.use(express.static(path.join(__dirname, '/capstone/build')));

// ✅ 예제 라우트
app.get('/pet', function (req, res) {
  connection.query('SELECT * FROM pets', (err, results) => {
    if (err) {
      res.status(500).send('DB 조회 실패');
    } else {
      res.json(results);
    }
  });
});

// ✅ React 라우팅 지원
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/capstone/build/index.html'));
});

app.listen(PORT, function () {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

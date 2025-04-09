const express = require('express');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 8081;

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
    return;
  }
  console.log('✅ MySQL 연결 성공!');

  // ✅ 테이블 자동 생성
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createSpacesTable = `
    CREATE TABLE IF NOT EXISTS spaces (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100),
      location VARCHAR(100),
      capacity INT,
      price INT,
      description TEXT,
      image_url TEXT
    );
  `;

  const createReservationsTable = `
    CREATE TABLE IF NOT EXISTS reservations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      space_id VARCHAR(50),
      date DATE,
      start_time TIME,
      end_time TIME,
      people INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (space_id) REFERENCES spaces(id)
    );
  `;

  // 순차 실행
  connection.query(createUsersTable, err => {
    if (err) return console.error('❌ users 테이블 생성 실패:', err);
    console.log('✅ users 테이블 생성 완료!');

    connection.query(createSpacesTable, err => {
      if (err) return console.error('❌ spaces 테이블 생성 실패:', err);
      console.log('✅ spaces 테이블 생성 완료!');

      connection.query(createReservationsTable, err => {
        if (err) return console.error('❌ reservations 테이블 생성 실패:', err);
        console.log('✅ reservations 테이블 생성 완료!');
      });
    });
  });
});

// ✅ 서버 라우팅 예시
app.get('/pet', (req, res) => {
  res.send('welcome to pet site');
});

// ✅ 정적 React 빌드 서빙 (필요한 경우)
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

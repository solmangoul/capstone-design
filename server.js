const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 8081;

app.use(cors({
  origin: 'http://localhost:5173', // Vite 프론트 주소
  credentials: true
}));

app.use(bodyParser.json());

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

  // ✅ users 테이블
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // ✅ spaces 테이블
  const createSpacesTable = `
    CREATE TABLE IF NOT EXISTS spaces (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      lat DOUBLE,
      lng DOUBLE,
      capacity INT,
      price INT NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  // ✅ 테이블 생성
  connection.query(createUsersTable, err => {
    if (err) return console.error('❌ users 테이블 생성 실패:', err);
    console.log('✅ users 테이블 생성 완료!');

    connection.query(createSpacesTable, err => {
      if (err) return console.error('❌ spaces 테이블 생성 실패:', err);
      console.log('✅ spaces 테이블 생성 완료!');
    });
  });
});

// ✅ 회원가입 API
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: '비밀번호 해싱 실패' });

    const sql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
    connection.query(sql, [username, hashedPassword, email], (err, results) => {
      if (err) {
        console.error('❌ 회원가입 실패:', err);
        return res.status(500).json({ message: '회원가입 중 오류 발생' });
      }

      res.status(200).json({ message: '회원가입 성공!' });
    });
  });
});

// ✅ 로그인 API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = ?`;
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error('❌ 로그인 쿼리 실패:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: '존재하지 않는 이메일입니다' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('❌ 비밀번호 비교 실패:', err);
        return res.status(500).json({ message: '서버 오류' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' });
      }

      res.status(200).json({
        message: '로그인 성공!',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    });
  });
});

// ✅ 추천 장소 등록 API (lat, lng 저장 포함)
app.post('/api/recommend', (req, res) => {
  const {
    name,
    location,
    lat,
    lng,
    description = '',
    imageUrl = ''
    // category // 향후 확장 시 테이블에 추가
  } = req.body;

  if (!name || !location || !lat || !lng) {
    return res.status(400).json({ message: '장소명, 주소, 위도, 경도는 필수입니다.' });
  }

  const sql = `
    INSERT INTO spaces (name, location, lat, lng, description, image_url, capacity, price)
    VALUES (?, ?, ?, ?, ?, ?, 0, 0)
  `;

  connection.query(
    sql,
    [name, location, lat, lng, description, imageUrl],
    (err, result) => {
      if (err) {
        console.error('❌ 장소 등록 실패:', err);
        return res.status(500).json({ message: 'DB 오류 발생' });
      }

      res.status(200).json({ message: '장소가 등록되었습니다!', id: result.insertId });
    }
  );
});

// ✅ 테스트 라우트
app.get('/pet', (req, res) => {
  res.send('welcome to pet site');
});

// ✅ 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 8081;

// ✅ 미들웨어
app.use(cors());
app.use(express.json());

// ✅ 정적 파일 서빙 (vite → dist 사용)
app.use(express.static(path.join(__dirname, 'frontend/dist')));

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
});

// ✅ 회원가입
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPw = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

    connection.query(query, [username, email, hashedPw], (err, results) => {
      if (err) {
        console.error('❌ 회원가입 실패:', err);
        return res.status(500).json({ message: '회원가입 실패', error: err });
      }

      console.log('✅ 회원가입 성공:', results);
      res.status(201).json({ message: '회원가입 성공' });
    });
  } catch (error) {
    res.status(500).json({ message: '암호화 오류', error });
  }
});

// ✅ 로그인
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT id, username, password FROM users WHERE email = ?`;

  connection.query(query, [email], async (err, results) => {
    if (err) {
      console.error('❌ 로그인 오류:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: '이메일이 존재하지 않습니다.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    res.status(200).json({
      message: '로그인 성공',
      token: 'fake-token',
      username: user.username,
      userId: user.id,
    });
  });
});

// ✅ React 라우팅 대응 (SPA용)
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
// ✅ React 라우팅 대응 (SPA용)
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});

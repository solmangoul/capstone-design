const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

// DB 연결
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ 회원가입 API
router.post('/register', (req, res) => {
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
router.post('/login', (req, res) => {
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

// ✅ 장소 등록 API (user_id 포함)
router.post('/recommend', (req, res) => {
  const {
    name,
    location,
    lat,
    lng,
    description = '',
    imageUrl = '',
    user_id
  } = req.body;

  if (!name || !location || !lat || !lng || !user_id) {
    return res.status(400).json({ message: '필수 항목 누락: name, location, lat, lng, user_id' });
  }

  const sql = `
    INSERT INTO spaces (name, location, lat, lng, description, image_url, capacity, price, user_id)
    VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?)
  `;

  connection.query(
    sql,
    [name, location, lat, lng, description, imageUrl, user_id],
    (err, result) => {
      if (err) {
        console.error('❌ 장소 등록 실패:', err);
        return res.status(500).json({ message: 'DB 오류 발생' });
      }

      res.status(200).json({ message: '장소가 등록되었습니다!', id: result.insertId });
    }
  );
});

// ✅ 사용자별 등록 장소 조회 API
router.get('/my-spaces/:userId', (req, res) => {
  const { userId } = req.params;

  const sql = `SELECT * FROM spaces WHERE user_id = ? ORDER BY created_at DESC`;
  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('❌ 사용자 장소 조회 실패:', err);
      return res.status(500).json({ message: 'DB 오류 발생' });
    }

    res.status(200).json(results);
  });
});

// ✅ 테스트용 기본 라우트
router.get('/', (req, res) => {
  res.send('✅ user.js 라우터 작동 중!');
});

module.exports = router;

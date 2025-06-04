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

// 회원가입 API
router.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: '비밀번호 해싱 실패' });

    connection.query(
      `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
      [username, hash, email],
      (err) => {
        if (err) return res.status(500).json({ message: '회원가입 중 오류 발생' });
        res.status(200).json({ message: '회원가입 성공!' });
      }
    );
  });
});

// 로그인 API
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  connection.query(`SELECT * FROM users WHERE email = ?`, [email], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: '로그인 실패' });
    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (match) {
        res.status(200).json({
          message: '로그인 성공!',
          user: { id: user.id, username: user.username, email: user.email },
        });
      } else {
        res.status(401).json({ message: '비밀번호 오류' });
      }
    });
  });
});

// 장소 등록 API (중복 확인 포함)
router.post('/recommend', (req, res) => {
  const {
    id, place_name, category_name, category_group_code,
    category_group_name, phone, address_name, road_address_name,
    x, y, place_url, user_id
  } = req.body;

  if (!user_id || !id || !place_name || !address_name || !x || !y) {
    return res.status(400).json({ message: '필수 항목 누락됨' });
  }

  const checkSql = 'SELECT * FROM kakao_places WHERE place_id = ? AND user_id = ?';
  connection.query(checkSql, [id, user_id], (err, results) => {
    if (err) return res.status(500).json({ message: '중복 확인 중 오류 발생' });
    if (results.length > 0) {
      return res.status(409).json({ message: '이미 등록된 장소입니다.' });
    }

    const insertSql = `INSERT INTO kakao_places (
      place_id, place_name, category_name, category_group_code, category_group_name,
      phone, address_name, road_address_name, lat, lng, place_url, user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      id, place_name, category_name || '', category_group_code || '', category_group_name || '',
      phone || '', address_name, road_address_name || '', parseFloat(y), parseFloat(x), place_url || '', user_id
    ];

    connection.query(insertSql, values, (err) => {
      if (err) return res.status(500).json({ message: 'DB 저장 실패' });
      res.status(200).json({ message: '장소 저장 완료!', id });
    });
  });
});

// 내 장소 목록 API
router.get('/my-spaces/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = `SELECT * FROM kakao_places WHERE user_id = ? ORDER BY created_at DESC`;
  connection.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: '조회 실패' });
    res.status(200).json(results);
  });
});

// 전체 장소 목록 API (홈페이지에서 사용)
router.get('/all-spaces', (req, res) => {
  const sql = `SELECT * FROM kakao_places ORDER BY created_at DESC`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('❌ 전체 장소 조회 실패:', err);
      return res.status(500).json({ message: '조회 실패' });
    }
    res.status(200).json(results);
  });
});

// 리뷰 저장 API
router.post('/review', (req, res) => {
  const { user_id, place_id, review, rating } = req.body;
  if (!user_id || !place_id || !review) {
    return res.status(400).json({ message: '필수 항목 누락' });
  }

  const sql = `INSERT INTO reviews (user_id, place_id, review, rating, created_at) VALUES (?, ?, ?, ?, NOW())`;
  connection.query(sql, [user_id, place_id, review, rating], (err) => {
    if (err) return res.status(500).json({ message: 'DB 저장 실패' });
    res.status(200).json({ message: '리뷰 등록 완료' });
  });
});

router.get('/reviews/:place_id', (req, res) => {
  const placeId = req.params.place_id;
  const sql = `
    SELECT reviews.*, users.username
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    WHERE place_id = ?
    ORDER BY created_at DESC
  `;
  connection.query(sql, [placeId], (err, results) => {
    if (err) return res.status(500).json({ message: '리뷰 조회 실패' });
    res.status(200).json(results);
  });
});

// 내 리뷰 조회
router.get('/my-reviews/:userId', (req, res) => {
  const sql = `
    SELECT r.id, r.review, r.rating, r.created_at, k.place_name
    FROM reviews r
    JOIN kakao_places k ON r.place_id = k.place_id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `;
  connection.query(sql, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ message: '리뷰 조회 실패' });
    res.status(200).json(results);
  });
});


// 리뷰 수정
router.put('/review/:id', (req, res) => {
  const { review, rating } = req.body;
  const sql = `UPDATE reviews SET review = ?, rating = ? WHERE id = ?`;
  connection.query(sql, [review, rating, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: '리뷰 수정 실패' });
    res.status(200).json({ message: '리뷰가 수정되었습니다.' });
  });
});


router.delete('/place/:placeId', (req, res) => {
  const sql = `DELETE FROM kakao_places WHERE place_id = ?`;
  connection.query(sql, [req.params.placeId], (err, results) => {
    if (err) return res.status(500).json({ message: '장소 삭제 실패' });
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: '삭제할 장소가 없습니다.' });
    }
    res.status(200).json({ message: '장소가 삭제되었습니다.' });
  });
});

router.delete('/review/:id', (req, res) => {
  const sql = `DELETE FROM reviews WHERE id = ?`;
  connection.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: '리뷰 삭제 실패' });
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: '삭제할 리뷰가 없습니다.' });
    }
    res.status(200).json({ message: '리뷰가 삭제되었습니다.' });
  });
});




// 기본 테스트 라우트
router.get('/', (req, res) => res.send('✅ router.js 라우터 작동 중!'));

module.exports = router;

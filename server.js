const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());

// 라우터 불러오기
const userRouter = require('./routes/router.js');
app.use('/api', userRouter);

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'dist')));

// 모든 라우트는 index.html로 보내기 (SPA용)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

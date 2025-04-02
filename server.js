const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 8080;

// ✅ MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB 연결 성공!'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// ✅ React 정적 파일 서빙 (빌드된 결과물)
app.use(express.static(path.join(__dirname, '/capstone/build')));

// ✅ 예제 라우트
app.get('/pet', function (req, res) {
  res.send('welcome to pet site1');
});

// ✅ 모든 나머지 요청은 React 앱으로 보내기
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/capstone/build/index.html'));
});

// ✅ 서버 시작
app.listen(PORT, function () {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ 컴포넌트가 렌더링되는지 확인
  useEffect(() => {
    console.log('✅ LoginPage 렌더링됨');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('✅ 로그인 버튼 클릭됨');

    try {
      const res = await axios.post('http://localhost:8081/api/login', {
        email,
        password,
      });

      console.log('✅ 백엔드 응답 확인:', res.data);

      if (!res.data || !res.data.user) {
        alert('로그인 응답 구조가 잘못되었습니다.');
        console.error('❌ 응답 user 데이터 없음:', res.data);
        return;
      }

      const { id, username, email: userEmail } = res.data.user;

      const userData = { id, username, email: userEmail };
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(userData));

      alert(`환영합니다, ${username}님!`);
      navigate('/');
    } catch (err) {
      console.error('❌ 로그인 실패 응답:', err.response?.data || err.message);
      alert('로그인 실패: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">로그인</h2>

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          로그인 유지하기
        </label>

        <button type="button" onClick={handleLogin}>
          로그인
        </button>

        <div className="auth-footer">
          계정이 없으신가요?{' '}
          <a href="/register" style={{ color: '#4f46e5' }}>
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

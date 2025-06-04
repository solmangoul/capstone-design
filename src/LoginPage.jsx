import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

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
      window.location.reload();
    } catch (err) {
      console.error('❌ 로그인 실패 응답:', err.response?.data || err.message);
      alert('로그인 실패: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <h2 className="auth-title">로그인</h2>

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px' }}
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px' }}
          />

          <button type="submit" style={{ width: '100%' }}>
            로그인
          </button>
        </form>

        <div style={{ marginTop: '12px', width: '100%', display: 'flex', justifyContent: 'flex-start', fontSize: '14px' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            <span style={{ marginRight: '6px' }}>로그인 유지하기</span>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              style={{ width: '16px', height: '16px' }}
            />
          </label>
        </div>

        <div className="auth-footer" style={{ marginTop: '20px', fontSize: '14px', width: '100%', textAlign: 'left' }}>
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

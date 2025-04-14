import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8081/api/login', {
        email,
        password,
      });

      const { token, username } = res.data;

      const userData = {
        token,
        username,
      };

      // 로그인 상태 저장 (유지 여부에 따라)
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData));
      }

      alert(`환영합니다, ${username}님!`);
      navigate('/');
    } catch (err) {
      alert('로그인 실패: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-container" onSubmit={handleLogin}>
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

        <button type="submit">로그인</button>

        <div className="auth-footer">
          계정이 없으신가요?{' '}
          <a href="/register" style={{ color: '#4f46e5' }}>
            회원가입
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;

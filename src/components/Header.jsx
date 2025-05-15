import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored =
      localStorage.getItem('user') || sessionStorage.getItem('user');

    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setUser(null);
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <header className="header">
      <a href="/">
        <img src={logo} alt="로고" className="logo" />
      </a>

      <input
        type="text"
        className="search-bar"
        placeholder="취미 공간 검색..."
      />

      <div className="nav-buttons">
        <button className="host">호스트 되기</button>
        {user ? (
          <>
            <span style={{ marginRight: '10px' }}>
              👋 {user.username}님
            </span>
            <button className="host" onClick={() => navigate('/mypage')}>
              마이페이지
            </button>
            <button className="login" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <button className="login" onClick={() => navigate('/login')}>
            로그인
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;

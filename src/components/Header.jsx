import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // location 추가
import logo from '../assets/logo.png';

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 확인
  const [user, setUser] = useState(null);

  // ✅ 로그인/회원가입 페이지에서는 헤더 숨김
  const hideHeaderRoutes = ['/login', '/register'];
  if (hideHeaderRoutes.includes(location.pathname)) {
    return null;
  }

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
        {user ? (
          <>
            <button className="host" onClick={() => navigate('/recommend')}>
              장소 추천하기
            </button>
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
          <>
            <button className="host" onClick={() => navigate('/recommend')}>
              장소 추천하기
            </button>
            <button className="login" onClick={() => navigate('/login')}>
              로그인
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

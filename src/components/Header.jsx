import React from 'react';
import logo from '../assets/logo.png'; // ✅ 이미지 파일 import

function Header() {
  return (
    <header className="header">
      <a href="/">
        <img src={logo} alt="로고" className="logo" />
      </a>
      <input type="text" className="search-bar" placeholder="취미 공간 검색..." />
      <div className="nav-buttons">
        <button className="host">호스트 되기</button>
        <button className="login">로그인</button>
      </div>
    </header>
  );
}

export default Header;

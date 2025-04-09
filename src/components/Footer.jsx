import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h4>PlayWITH 소개</h4>
        <p>회사 소개</p>
        <p>채용</p>
        <p>보도자료</p>
        <p>블로그</p>
      </div>
      <div>
        <h4>커뮤니티</h4>
        <p>호스트 가이드라인</p>
        <p>커뮤니티 포럼</p>
        <p>고객지원</p>
      </div>
      <div>
        <h4>법적 고지</h4>
        <p>서비스 이용약관</p>
        <p>개인정보 처리방침</p>
        <p>쿠키 정책</p>
      </div>
      <div>
        <h4>팔로우</h4>
        <p>🔗 Facebook</p>
        <p>🔗 Twitter</p>
        <p>🔗 Instagram</p>
      </div>
      <div className="footer-bottom">
        © 2024 PlayWITH. 모든 권리 보유.
      </div>
    </footer>
  );
}

export default Footer;

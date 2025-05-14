import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './mypage.css';

const MyPage = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [reservations, setReservations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activities, setActivities] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('/api/user');
        const reservationsRes = await axios.get('/api/reservations');
        const favoritesRes = await axios.get('/api/favorites');
        const reviewsRes = await axios.get('/api/reviews');
        const activitiesRes = await axios.get('/api/activities');
        const inquiriesRes = await axios.get('/api/inquiries');

        setUser(userRes.data || {});

        // 각 응답에서 배열만 추출
        setReservations(
          Array.isArray(reservationsRes.data)
            ? reservationsRes.data
            : reservationsRes.data.data || []
        );
        setFavorites(
          Array.isArray(favoritesRes.data)
            ? favoritesRes.data
            : favoritesRes.data.data || []
        );
        setReviews(
          Array.isArray(reviewsRes.data)
            ? reviewsRes.data
            : reviewsRes.data.data || []
        );
        setActivities(
          Array.isArray(activitiesRes.data)
            ? activitiesRes.data
            : activitiesRes.data.data || []
        );
        setInquiries(
          Array.isArray(inquiriesRes.data)
            ? inquiriesRes.data
            : inquiriesRes.data.data || []
        );
      } catch (error) {
        console.error('마이페이지 데이터 로딩 실패:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* 상단바 */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <a href="/">PLAYWITH</a>
          </div>
          <nav className="nav-menu">
            <a href="/spaces">공간 찾기</a>
            <a href="/mypage">마이페이지</a>
            <a href="/logout">로그아웃</a>
          </nav>
        </div>
      </header>

      {/* 마이페이지 본문 */}
      <div className="mypage">
        {/* 사이드바 */}
        <aside className="sidebar">
          <h2>마이페이지</h2>
          <ul>
            <li><a href="#profile">회원 정보 관리</a></li>
            <li><a href="#reservations">예약 내역</a></li>
            <li><a href="#favorites">찜 목록</a></li>
            <li><a href="#reviews">리뷰 관리</a></li>
            <li><a href="#activity">내 활동</a></li>
            <li><a href="#inquiries">문의 내역</a></li>
          </ul>
        </aside>

        {/* 콘텐츠 영역 */}
        <section className="content">
          {/* 회원 정보 */}
          <section id="profile">
            <h3>회원 정보 관리</h3>
            <div className="profile-box">
              <p><strong>이름:</strong> {user.name}</p>
              <p><strong>이메일:</strong> {user.email}</p>
              <button>정보 수정</button>
            </div>
          </section>

          {/* 예약 내역 */}
          <section id="reservations">
            <h3>예약 내역</h3>
            <div className="reservation-list">
              {Array.isArray(reservations) && reservations.length > 0 ? (
                reservations.map(res => (
                  <div key={res.id} className="reservation-card">
                    <h4>{res.spaceName}</h4>
                    <p>예약일: {res.date}</p>
                    <p>상태: {res.status}</p>
                  </div>
                ))
              ) : (
                <p>예약 내역이 없습니다.</p>
              )}
            </div>
          </section>

          {/* 찜 목록 */}
          <section id="favorites">
            <h3>찜한 공간</h3>
            <ul className="favorites-list">
              {Array.isArray(favorites) && favorites.length > 0 ? (
                favorites.map((fav, idx) => (
                  <li key={idx}>
                    {typeof fav === 'string' ? fav : fav.name || '이름 없음'}
                  </li>
                ))
              ) : (
                <p>찜한 공간이 없습니다.</p>
              )}
            </ul>
          </section>

          {/* 리뷰 관리 */}
          <section id="reviews">
            <h3>작성한 리뷰</h3>
            <div>
              {Array.isArray(reviews) && reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="review-item">
                    {review.text || '내용 없음'}
                  </div>
                ))
              ) : (
                <p>작성한 리뷰가 없습니다.</p>
              )}
            </div>
          </section>

          {/* 내 활동 */}
          <section id="activity">
            <h3>내 활동 타임라인</h3>
            <ul className="activity-log">
              {Array.isArray(activities) && activities.length > 0 ? (
                activities.map((activity, idx) => (
                  <li key={idx}>{activity}</li>
                ))
              ) : (
                <p>활동 기록이 없습니다.</p>
              )}
            </ul>
          </section>

          {/* 문의 내역 */}
          <section id="inquiries">
            <h3>문의 내역</h3>
            <div>
              {Array.isArray(inquiries) && inquiries.length > 0 ? (
                inquiries.map(inquiry => (
                  <div key={inquiry.id} className="inquiry-item">
                    {inquiry.text || '문의 내용 없음'}
                  </div>
                ))
              ) : (
                <p>문의 내역이 없습니다.</p>
              )}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

export default MyPage;

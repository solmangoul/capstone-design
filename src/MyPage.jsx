import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './mypage.css';
import logo from './assets/logo.png'; // 로고만 사용

const MyPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: '', email: '' });
  const [reservations, setReservations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activities, setActivities] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const stored =
      localStorage.getItem('user') || sessionStorage.getItem('user');

    if (!stored) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await axios.get('/api/user');
        const reservationsRes = await axios.get('/api/reservations');
        const favoritesRes = await axios.get('/api/favorites');
        const reviewsRes = await axios.get('/api/reviews');
        const activitiesRes = await axios.get('/api/activities');
        const inquiriesRes = await axios.get('/api/inquiries');

        setUser(userRes.data || {});
        setReservations(Array.isArray(reservationsRes.data) ? reservationsRes.data : reservationsRes.data.data || []);
        setFavorites(Array.isArray(favoritesRes.data) ? favoritesRes.data : favoritesRes.data.data || []);
        setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : reviewsRes.data.data || []);
        setActivities(Array.isArray(activitiesRes.data) ? activitiesRes.data : activitiesRes.data.data || []);
        setInquiries(Array.isArray(inquiriesRes.data) ? inquiriesRes.data : inquiriesRes.data.data || []);
      } catch (error) {
        console.error('마이페이지 데이터 로딩 실패:', error);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div>
      {/* 상단 로고만 */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <a href="/">
              <img src={logo} alt="로고" className="logo-img" />
            </a>
          </div>
        </div>
      </header>

      {/* 마이페이지 본문 이하 생략 (기존과 동일) */}
      {/* ... */}
    </div>
  );
};

export default MyPage;

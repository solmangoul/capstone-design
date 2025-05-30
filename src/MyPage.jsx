import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './mypage.css';
import logo from './assets/logo.png';

const MyPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', email: '' });
  const [myPlaces, setMyPlaces] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!stored) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    axios.get(`http://localhost:8081/api/my-spaces/${parsed.id}`)
      .then(res => {
        const places = Array.isArray(res.data) ? res.data : [];
        setMyPlaces(places);
      })
      .catch(err => {
        console.error('❌ 내 장소 불러오기 실패:', err);
        alert('등록한 장소를 불러오는 데 실패했습니다.');
      });
  }, [navigate]);

  return (
    <div className="mypage">
      {/* 사이드바 */}
      <aside className="sidebar">
        <h2>마이페이지</h2>
        <ul>
          <li><a href="/mypage">내 장소 목록</a></li>
          <li><a href="/">홈으로</a></li>
        </ul>
      </aside>

      {/* 본문 */}
      <main className="content">
        <section className="profile-box">
          <h3>👤 내 정보</h3>
          <p><strong>이름:</strong> {user.username}</p>
          <p><strong>이메일:</strong> {user.email}</p>
        </section>

        <section>
          <h3>📌 내가 등록한 장소</h3>
          <div className="reservation-list">
            {myPlaces.length === 0 ? (
              <p>등록한 장소가 없습니다.</p>
            ) : (
              myPlaces.map((place) => (
                <div key={place.place_id || place.id} className="reservation-card">
                  <h4>{place.place_name || place.name}</h4>
                  <p>{place.address_name || place.location}</p>
                  <p>📍 위도: {place.lat || place.y}</p>
                  <p>📍 경도: {place.lng || place.x}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyPage;

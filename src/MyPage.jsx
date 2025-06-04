import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './mypage.css';

const MyPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', email: '' });
  const [myPlaces, setMyPlaces] = useState([]);
  const [myReviews, setMyReviews] = useState([]);

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
        setMyPlaces(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error('❌ 내 장소 불러오기 실패:', err);
        alert('등록한 장소를 불러오는 데 실패했습니다.');
      });

    axios.get(`http://localhost:8081/api/my-reviews/${parsed.id}`)
      .then(res => {
        setMyReviews(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error('❌ 내 리뷰 불러오기 실패:', err);
        alert('리뷰 불러오는 데 실패했습니다.');
      });
  }, [navigate]);

  const handleDeletePlace = async (placeId) => {
  console.log('🟡 삭제하려는 장소 ID:', placeId);
  try {
    const res = await axios.delete(`http://localhost:8081/api/place/${placeId}`);
    console.log('🟢 장소 삭제 응답:', res.data);
    setMyPlaces(prev => prev.filter(p => p.place_id !== placeId));
    alert('장소가 삭제되었습니다.');
  } catch (err) {
    console.error('❌ 장소 삭제 실패:', err.response?.data || err.message || err);
    alert('장소 삭제에 실패했습니다: ' + (err.response?.data?.message || '서버 오류'));
  }
};

const handleDeleteReview = async (reviewId) => {
  console.log('🟡 삭제하려는 리뷰 ID:', reviewId);
  try {
    const res = await axios.delete(`http://localhost:8081/api/review/${reviewId}`);
    console.log('🟢 리뷰 삭제 응답:', res.data);
    setMyReviews(prev => prev.filter(r => r.id !== reviewId));
    alert('리뷰가 삭제되었습니다.');
  } catch (err) {
    console.error('❌ 리뷰 삭제 실패:', err.response?.data || err.message || err);
    alert('리뷰 삭제에 실패했습니다: ' + (err.response?.data?.message || '서버 오류'));
  }
};

  return (
    <div className="mypage">
      <aside className="sidebar">
        <h2>마이페이지</h2>
        <ul>
          <li><a href="/mypage">내 장소 목록</a></li>
          <li><a href="/">홈으로</a></li>
        </ul>
      </aside>

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
                <div key={place.place_id} className="reservation-card">
                  <h4>{place.place_name}</h4>
                  <p>{place.address_name}</p>
                  <p>📍 위도: {place.lat}</p>
                  <p>📍 경도: {place.lng}</p>
                  <button onClick={() => handleDeletePlace(place.place_id)}>삭제</button>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h3>📝 내가 작성한 리뷰</h3>
          <div className="reservation-list">
            {myReviews.length === 0 ? (
              <p>작성한 리뷰가 없습니다.</p>
            ) : (
              myReviews.map((review) => (
                <div key={review.id} className="reservation-card">
                  <h4>{review.place_name}</h4>
                  <p><strong>평점:</strong> {review.rating}점</p>
                  <p>{review.review}</p>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>
                    작성일: {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  <button onClick={() => handleDeleteReview(review.id)}>삭제</button>
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

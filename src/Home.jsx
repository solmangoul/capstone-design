// Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [searchRegion, setSearchRegion] = useState('');
  const [spaces, setSpaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await axios.get('http://localhost:8081/api/all-spaces');
        setSpaces(res.data);
      } catch (err) {
        console.error('❌ 공간 불러오기 실패:', err);
      }
    };
    fetchSpaces();
  }, []);

  useEffect(() => {
    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) return;

      window.kakao.maps.load(() => {
        const container = document.getElementById('popup-map');
        const options = {
          center: new window.kakao.maps.LatLng(selectedPlace.lat, selectedPlace.lng),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(selectedPlace.lat, selectedPlace.lng),
          title: selectedPlace.place_name,
        });
      });
    };

    if (isModalOpen && selectedPlace) {
      if (!window.kakao || !window.kakao.maps) {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=eecf90a23b757cec59fc8c1828d64ce3&autoload=false&libraries=services`;
        script.async = true;
        script.onload = loadMap;
        document.head.appendChild(script);
      } else {
        loadMap();
      }
    }
  }, [isModalOpen, selectedPlace]);

  const handleCardClick = (place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const categoryList = ['전체', '문화시설', '카페', '음식점', '노래방', '숙박', '병원', '학교', '은행'];
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const handleCategoryClick = (name) => setSelectedCategory(name);

  const filteredSpaces = spaces.filter((space) => {
    const categoryMatch = selectedCategory === '전체' || space.category_group_name === selectedCategory;
    const regionMatch = !searchRegion || space.address_name.includes(searchRegion);
    return categoryMatch && regionMatch;
  });

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>당신의 공간을 탐험하세요</h1>
          <p>원하는 지역과 카테고리를 선택해 장소를 검색하고, 직접 리뷰도 남겨보세요.</p>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="예: 서울특별시"
          value={searchRegion}
          onChange={(e) => setSearchRegion(e.target.value)}
        />
      </div>

      <div className="categories">
        {categoryList.map((cat) => (
          <button
            key={cat}
            className={`category-button ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className="results">
        {filteredSpaces.map((space) => (
          <div
            key={space.place_id}
            className="card"
            onClick={() => handleCardClick(space)}
          >
            <h3>{space.place_name}</h3>
            <p>{space.category_group_name || space.category_name}</p>
            <p>{space.address_name}</p>
          </div>
        ))}
      </section>

      {isModalOpen && selectedPlace && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedPlace.place_name}</h2>
            <p>📍 주소: {selectedPlace.address_name}</p>
            <p>📞 전화: {selectedPlace.phone || '정보 없음'}</p>
            <p>🏷️ 카테고리: {selectedPlace.category_name}</p>
            <p>
              🔗 링크: <a href={selectedPlace.place_url} target="_blank" rel="noreferrer">{selectedPlace.place_url}</a>
            </p>

            <div id="popup-map" className="popup-map"></div>

            <ReviewForm placeId={selectedPlace.place_id} />
            <button onClick={() => setIsModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

const ReviewForm = ({ placeId }) => {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewList, setReviewList] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/reviews/${placeId}`);
      if (!res.ok) throw new Error('리뷰 불러오기 실패');
      const data = await res.json();
      setReviewList(data);
    } catch (err) {
      console.error('❌ 리뷰 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [placeId]);

  const handleSubmit = async () => {
    if (!user) return alert('로그인이 필요합니다.');

    try {
      const res = await fetch('http://localhost:8081/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, place_id: placeId, review, rating }),
      });

      if (!res.ok) throw new Error('리뷰 등록 실패');
      alert('✅ 리뷰가 등록되었습니다!');
      setReview('');
      setRating(0);
      fetchReviews();
    } catch (err) {
      alert('❌ 등록 실패: ' + err.message);
    }
  };

  return (
    <div>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="리뷰를 입력하세요"
        rows="3"
        className="review-textarea"
      />
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
          >
            {star <= rating ? '⭐' : '☆'}
          </span>
        ))}
      </div>
      <button onClick={handleSubmit}>리뷰 등록</button>

      <hr className="review-divider" />
      <h4>📋 등록된 리뷰</h4>
      {reviewList.length === 0 ? (
        <p>아직 리뷰가 없습니다.</p>
      ) : (
        reviewList.map((r) => (
          <div key={r.id} className="review-card">
            <p>👤 <strong>{r.username}</strong></p>
            <p>⭐ {r.rating}점</p>
            <p>{r.review}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;

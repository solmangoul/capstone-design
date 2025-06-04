// Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [searchRegion, setSearchRegion] = useState('');
  const [spaces, setSpaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryList, setCategoryList] = useState(['전체']);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [userPosition, setUserPosition] = useState(null);
  const [sortByDistance, setSortByDistance] = useState(false);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await axios.get('http://localhost:8081/api/all-spaces');
        setSpaces(res.data);

        const categories = new Set();
        res.data.forEach(space => {
          if (space.category_group_name) categories.add(space.category_group_name);
        });
        setCategoryList(['전체', ...Array.from(categories)]);
      } catch (err) {
        console.error('❌ 공간 불러오기 실패:', err);
      }
    };
    fetchSpaces();
  }, []);

  const loadUserMap = () => {
    if (!window.kakao || !window.kakao.maps) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setUserPosition({ lat, lng });

      const container = document.getElementById('user-map');
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);

      new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(lat, lng),
        title: '현재 위치',
      });
    }, (err) => {
      alert('위치 정보를 가져올 수 없습니다.');
      console.error(err);
    });
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=eecf90a23b757cec59fc8c1828d64ce3&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(loadUserMap);
    document.head.appendChild(script);
  }, []);

  // ✅ 팝업 모달 열릴 때 지도 생성
  useEffect(() => {
    if (!isModalOpen || !selectedPlace || !window.kakao || !window.kakao.maps) return;

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
  }, [isModalOpen, selectedPlace]);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371e3;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lng2 - lng1);
    const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d < 1000 ? `${Math.round(d)}m` : `${(d/1000).toFixed(1)}km`;
  };

  const calculateDistanceValue = (lat1, lng1, lat2, lng2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371e3;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lng2 - lng1);
    const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleCategoryClick = (cat) => setSelectedCategory(cat);

  const filteredSpaces = spaces
    .filter(space => {
      const categoryMatch = selectedCategory === '전체' || space.category_group_name === selectedCategory;
      const regionMatch = !searchRegion || space.address_name.includes(searchRegion);
      return categoryMatch && regionMatch;
    })
    .sort((a, b) => {
      if (!sortByDistance || !userPosition) return 0;
      const d1 = calculateDistanceValue(userPosition.lat, userPosition.lng, a.lat, a.lng);
      const d2 = calculateDistanceValue(userPosition.lat, userPosition.lng, b.lat, b.lng);
      return d1 - d2;
    });

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>당신의 공간을 탐험하세요</h1>
          <p>원하는 지역과 카테고리를 선택해 장소를 검색하고, 직접 리뷰도 남겨보세요.</p>
        </div>
      </div>

      <div id="user-map" style={{ width: '100%', height: '400px', borderRadius: '10px', marginBottom: '12px' }}></div>
      <button className="refresh-location-btn" onClick={loadUserMap}>📍 현재 위치 재탐색</button>

      <div className="search-box">
        <input
          type="text"
          placeholder="예: 서울특별시"
          value={searchRegion}
          onChange={(e) => setSearchRegion(e.target.value)}
        />
      </div>

      <div className="sort-button-box">
        <button
          className={`sort-button ${sortByDistance ? 'active' : ''}`}
          onClick={() => setSortByDistance(!sortByDistance)}
        >📏 거리순 정렬 {sortByDistance ? '해제' : '적용'}</button>
      </div>

      <div className="categories">
        {categoryList.map(cat => (
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
        {filteredSpaces.map(space => (
          <div className="card" key={space.place_id} onClick={() => { setSelectedPlace(space); setIsModalOpen(true); }}>
            <h3>{space.place_name}</h3>
            <p>{space.category_group_name}</p>
            <p>{space.address_name}</p>
            <p>🏃 거리: {userPosition ? calculateDistance(userPosition.lat, userPosition.lng, space.lat, space.lng) : '계산 중...'}</p>
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
            <p>🔗 링크: <a href={selectedPlace.place_url} target="_blank" rel="noreferrer">{selectedPlace.place_url}</a></p>
            <p>🏃 현재 위치와 거리: {userPosition ? calculateDistance(userPosition.lat, userPosition.lng, selectedPlace.lat, selectedPlace.lng) : '계산 중...'}</p>
            <div id="popup-map" className="popup-map"></div>
            <ReviewForm placeId={selectedPlace.place_id} />
            <button onClick={() => setIsModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewForm({ placeId }) {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewList, setReviewList] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8081/api/reviews/${placeId}`)
      .then(res => res.json())
      .then(setReviewList)
      .catch(console.error);
  }, [placeId]);

  const handleSubmit = async () => {
    if (!user) return alert('로그인이 필요합니다.');
    const method = editingReviewId ? 'PUT' : 'POST';
    const url = editingReviewId
      ? `http://localhost:8081/api/review/${editingReviewId}`
      : `http://localhost:8081/api/review`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, place_id: placeId, review, rating }),
    });
    if (!res.ok) return alert('리뷰 처리 실패');
    setReview(''); setRating(0); setEditingReviewId(null);
    const refreshed = await fetch(`http://localhost:8081/api/reviews/${placeId}`).then(r => r.json());
    setReviewList(refreshed);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch(`http://localhost:8081/api/review/${id}`, { method: 'DELETE' });
    if (!res.ok) return alert('삭제 실패');
    const refreshed = await fetch(`http://localhost:8081/api/reviews/${placeId}`).then(r => r.json());
    setReviewList(refreshed);
  };

  return (
    <div>
      <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="리뷰 입력" />
      <div>{[1,2,3,4,5].map(s => <span key={s} onClick={() => setRating(s)}>{s <= rating ? '⭐' : '☆'}</span>)}</div>
      <button onClick={handleSubmit}>{editingReviewId ? '수정' : '등록'}</button>
      <hr />
      {reviewList.map(r => (
        <div key={r.id}>
          <p><b>{r.username}</b> - ⭐ {r.rating}</p>
          <p>{r.review}</p>
          {user && user.id === r.user_id && (
            <>
              <button onClick={() => { setReview(r.review); setRating(r.rating); setEditingReviewId(r.id); }}>수정</button>
              <button onClick={() => handleDelete(r.id)}>삭제</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Home;

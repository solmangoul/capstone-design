import React, { useEffect, useState } from 'react';
import './RecommendPage.css';

const RecommendPage = () => {
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);

  // 지도 로딩
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://dapi.kakao.com/v2/maps/sdk.js?appkey=🔑YOUR_JAVASCRIPT_KEY&autoload=false&libraries=services';
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 5,
        };
        const kakaoMap = new window.kakao.maps.Map(container, options);
        setMap(kakaoMap);
      });
    };
    document.head.appendChild(script);
  }, []);

  // 검색 함수
  const handleSearch = () => {
    if (!keyword.trim() || !map) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);

        const bounds = new window.kakao.maps.LatLngBounds();
        data.forEach((place) => {
          const position = new window.kakao.maps.LatLng(place.y, place.x);
          new window.kakao.maps.Marker({ map, position });
          bounds.extend(position);
        });
        map.setBounds(bounds);
      } else {
        setPlaces([]);
        alert('장소를 찾을 수 없습니다.');
      }
    });
  };

  // 장소 등록
const handleRegister = async (place) => {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));

  if (!user) {
    alert('로그인이 필요합니다.');
    return;
  }

  const newPlace = {
    name: place.place_name,
    location: place.address_name,
    lat: parseFloat(place.y),
    lng: parseFloat(place.x),
    description: '',
    imageUrl: '',
    user_id: user.id   // ✅ 사용자 ID 추가
  };

  try {
    const res = await fetch('http://localhost:8081/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlace)
    });

    if (!res.ok) throw new Error('저장 실패');

    const data = await res.json();
    alert(`✅ "${place.place_name}" 장소가 등록되었습니다! (ID: ${data.id})`);
  } catch (error) {
    console.error('❌ 장소 등록 실패:', error);
    alert('❌ 장소 등록 중 오류가 발생했습니다.');
  }
};


  return (
    <div className="recommend-container">
      <h2>📍 추천 장소 등록</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="장소를 입력하세요 (예: 홍대 연습실)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      <div id="map" className="map-area"></div>

      <div className="result-list">
        {places.length === 0 && <p>🔎 검색된 장소가 없습니다.</p>}
        {places.map((place) => (
          <div className="place-card" key={place.id}>
            <h3>{place.place_name}</h3>
            <p>{place.address_name}</p>
            <button onClick={() => handleRegister(place)}>장소 등록</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendPage;

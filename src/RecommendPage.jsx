import React, { useEffect, useState } from 'react';
import './RecommendPage.css';

const RecommendPage = () => {
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://dapi.kakao.com/v2/maps/sdk.js?appkey=eecf90a23b757cec59fc8c1828d64ce3&autoload=false&libraries=services';
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
        alert('장소를 찾을 수 없습니다.');
      }
    });
  };

  const handleRegister = async (place) => {
    const newPlace = {
      name: place.place_name,
      location: place.address_name,
      lat: parseFloat(place.y),
      lng: parseFloat(place.x),
      description: '',
      imageUrl: ''
    };

    try {
      const res = await fetch('http://localhost:8081/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlace)
      });

      if (!res.ok) throw new Error('저장 실패');

      const data = await res.json();
      alert(`✅ "${place.place_name}" 장소가 추천 목록에 등록되었습니다. (ID: ${data.id})`);
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
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      <div id="map" className="map-area"></div>

      <div className="result-list">
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

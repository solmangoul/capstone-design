import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const dummySpaces = [
  { id: 1, title: '파티룸', category: '파티룸', capacity: 10, location: '홍대', image: 'https://via.placeholder.com/300x200' },
  { id: 2, title: '보드게임룸', category: '보드게임', capacity: 4, location: '강남', image: 'https://via.placeholder.com/300x200' },
  { id: 3, title: '노래방', category: '노래방', capacity: 5, location: '신촌', image: 'https://via.placeholder.com/300x200' },
  { id: 4, title: '합주실', category: '합주실', capacity: 6, location: '건대', image: 'https://via.placeholder.com/300x200' },
  { id: 5, title: '보드게임룸', category: '보드게임', capacity: 2, location: '잠실', image: 'https://via.placeholder.com/300x200' },
];

function CategoryPage() {
  const { name } = useParams();
  const [sort, setSort] = useState('latest');

  const filtered = dummySpaces.filter((space) => space.category === name);
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'name': return a.title.localeCompare(b.title);
      case 'capacity-desc': return b.capacity - a.capacity;
      case 'capacity-asc': return a.capacity - b.capacity;
      default: return b.id - a.id;
    }
  });

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        // 현재 위치 마커
        new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(lat, lng),
          map,
          title: '현재 위치',
        });

        // 장소 검색
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(name, (data, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            data.forEach((place) => {
              const marker = new window.kakao.maps.Marker({
                map,
                position: new window.kakao.maps.LatLng(place.y, place.x),
                title: place.place_name,
              });

              const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;font-size:13px;">${place.place_name}</div>`,
              });

              window.kakao.maps.event.addListener(marker, 'click', () => {
                infowindow.open(map, marker);
              });
            });
          }
        });
      });
    });
  }, [name]);

  const handleSortChange = (e) => setSort(e.target.value);

  return (
    <div className="results">
      <div className="category-header">
        <h2>{name} 공간</h2>
        <select value={sort} onChange={handleSortChange} className="sort-select">
          <option value="latest">최신순</option>
          <option value="name">이름순</option>
          <option value="capacity-desc">인원 많은 순</option>
          <option value="capacity-asc">인원 적은 순</option>
        </select>
      </div>

      {/* ✅ 카카오 지도 삽입 */}
      <div id="map" style={{ width: '100%', height: '400px', marginBottom: '20px' }}></div>

      {sorted.length > 0 ? (
        sorted.map((space) => (
          <div key={space.id} className="card">
            <img src={space.image} alt={space.title} />
            <h3>{space.title}</h3>
            <p className="category-tag">{space.category} · {space.capacity}명</p>
          </div>
        ))
      ) : (
        <p className="no-result">해당 카테고리의 공간이 없습니다.</p>
      )}
    </div>
  );
}

export default CategoryPage;

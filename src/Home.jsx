import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import hostBg from './assets/host-bg.png';

function Home() {
  const navigate = useNavigate();
  const [searchRegion, setSearchRegion] = useState('');
  const [spaces, setSpaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');

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

  const handleCategoryClick = (name) => {
    setSelectedCategory(name);
  };

  const categoryList = ['전체', '문화시설', '카페', '음식점', '노래방', '숙박', '병원', '학교', '은행'];

  const filteredSpaces = spaces.filter((space) => {
    const categoryMatch = selectedCategory === '전체' || space.category_group_name === selectedCategory;
    const regionMatch = !searchRegion || space.address_name.includes(searchRegion);
    return categoryMatch && regionMatch;
  });

  return (
    <div className="home">
      <div className="search-background">
        {/* 🔹 지역 검색 필드 */}
        <div className="search-box" style={{ margin: '20px', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="예: 경기도, 서울특별시, 용인시, 대전광역시"
            value={searchRegion}
            onChange={(e) => setSearchRegion(e.target.value)}
            style={{ width: '300px', padding: '10px', fontSize: '16px' }}
          />
        </div>

        {/* 카테고리 버튼 */}
        <div className="categories" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
          {categoryList.map((cat) => (
            <button
              key={cat}
              className={`category-button ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                background: selectedCategory === cat ? '#4f46e5' : '#fff',
                color: selectedCategory === cat ? 'white' : '#333',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 추천 공간 카드 */}
        <section className="results" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', padding: '20px' }}>
          {filteredSpaces.map((space) => (
            <div key={space.place_id} className="card" style={{ width: '280px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', padding: '12px' }}>
              <h3 style={{ margin: '10px 0 6px' }}>{space.place_name}</h3>
              <p style={{ fontSize: '14px', color: '#555' }}>{space.category_group_name || space.category_name}</p>
              <p style={{ fontSize: '13px', color: '#777' }}>{space.address_name}</p>
            </div>
          ))}
        </section>
      </div>

      {/* 호스트 섹션 */}
      <section
        className="host-section"
        style={{
          backgroundImage: `url(${hostBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center',
        }}
      >
        <div className="host-text">
          <h2>추천하고 싶은 공간이 있나요?</h2>
          <p>당신만 알고 있는 멋진 장소를 다른 사람에게 소개해보세요.</p>
          <button onClick={() => navigate('/recommend')} style={{ marginTop: '16px', padding: '10px 20px', background: '#4f46e5', border: 'none', color: 'white', borderRadius: '4px' }}>
            장소 추천하기
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;

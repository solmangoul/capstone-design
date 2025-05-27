import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hostBg from './assets/host-bg.png';

const categories = [
  { icon: '🎉', name: '파티룸' },
  { icon: '🎵', name: '합주실' },
  { icon: '🎲', name: '보드게임' },
  { icon: '🎤', name: '노래방' },
];

const dummySpaces = [
  { id: 1, title: '파티룸', category: '파티룸', image: 'https://via.placeholder.com/300x200' },
  { id: 2, title: '보드게임룸', category: '보드게임', image: 'https://via.placeholder.com/300x200' },
  { id: 3, title: '노래방', category: '노래방', image: 'https://via.placeholder.com/300x200' },
  { id: 4, title: '합주실', category: '합주실', image: 'https://via.placeholder.com/300x200' },
];

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ location: '', date: '', start: '', end: '', people: '' });

  const handleSearchChange = (field) => (e) => {
    setSearch({ ...search, [field]: e.target.value });
  };

  const handleCategoryClick = (name) => {
    navigate(`/category/${name}`);
  };

  return (
    <div className="home">
      {/* 카테고리 아이콘 */}
      <div className="search-background">
        <div className="categories">
          {categories.map((cat) => (
            <div key={cat.name} className="category-icon-wrap" onClick={() => handleCategoryClick(cat.name)}>
              <div className="category-icon">{cat.icon}</div>
              <p className="category-label">{cat.name}</p>
            </div>
          ))}
        </div>

        {/* 메인 검색 섹션 */}
        <section className="hero">
          <div className="overlay">
            <h1>당신의 완벽한 취미 공간을 찾아보세요</h1>
            <div className="search-box">
              <input placeholder="📍 위치" value={search.location} onChange={handleSearchChange('location')} />
              <input type="date" value={search.date} onChange={handleSearchChange('date')} />
              <select value={search.start} onChange={handleSearchChange('start')}>
                {Array.from({ length: 48 }, (_, i) => {
                  const h = String(Math.floor(i / 2)).padStart(2, '0');
                  const m = i % 2 === 0 ? '00' : '30';
                  return <option key={i} value={`${h}:${m}`}>{`${h}:${m}`}</option>;
                })}
              </select>
              <select value={search.end} onChange={handleSearchChange('end')}>
                {Array.from({ length: 48 }, (_, i) => {
                  const h = String(Math.floor(i / 2)).padStart(2, '0');
                  const m = i % 2 === 0 ? '00' : '30';
                  return <option key={i} value={`${h}:${m}`}>{`${h}:${m}`}</option>;
                })}
              </select>
              <input type="number" placeholder="👤 인원" value={search.people} onChange={handleSearchChange('people')} />
            </div>
            <button className="search-button">공간 검색</button>
          </div>
        </section>

        {/* 추천 공간 카드 */}
        <section className="results">
          {dummySpaces.map((space) => (
            <div key={space.id} className="card">
              <img src={space.image} alt={space.title} />
              <h3>{space.title}</h3>
              <p className="category-tag">{space.category}</p>
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
        }}
      >
        <div className="host-text">
          <h2>추천하고 싶은 공간이 있나요?</h2>
          <p>당신만 알고 있는 멋진 장소를 다른 사람에게 소개해보세요. 지금 바로 추천해보세요!</p>
          <button onClick={() => navigate('/recommend')}>장소 추천하기</button>
        </div>
      </section>
    </div>
  );
}

export default Home;

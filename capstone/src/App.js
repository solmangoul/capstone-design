import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hours = String(Math.floor(i / 2)).padStart(2, '0');
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hours}:${minutes}`;
});

function App() {
  const [spaces, setSpaces] = useState([]);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [people, setPeople] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  // ✅ DB에서 공간 목록 불러오기
  useEffect(() => {
    axios.get('http://localhost:8081/spaces')
      .then(res => {
        setSpaces(res.data);
        setResults(res.data); // 초기 추천 공간에도 사용
      })
      .catch(err => {
        console.error('❌ 공간 목록 불러오기 실패:', err);
      });
  }, []);

  // ✅ 검색 필터
  const handleSearch = () => {
    const filtered = spaces.filter(
      (space) =>
        space.location.includes(location) &&
        space.capacity >= parseInt(people || 0)
    );
    setResults(filtered);
    setSearched(true);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Logo</div>
        <input type="text" className="search-bar" placeholder="취미 공간 검색..." />
        <div className="nav-buttons">
          <button className="host">호스트 되기</button>
          <button className="login">로그인</button>
        </div>
      </header>

      <section className="hero">
        <div className="overlay">
          <h1>당신의 완벽한 취미 공간을 찾아보세요</h1>
          <div className="search-box">
            <input placeholder="📍 위치" value={location} onChange={(e) => setLocation(e.target.value)} />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
              <option value="">시작 시간</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            <select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
              <option value="">종료 시간</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            <input type="number" placeholder="👤 인원" value={people} onChange={(e) => setPeople(e.target.value)} />
          </div>
          <button className="search-button" onClick={handleSearch}>공간 검색</button>
        </div>
      </section>

      <section className="categories">
        <div className="category-icon-wrap">
          <div className="category-icon">🎉</div>
          <p className="category-label">파티룸</p>
        </div>
        <div className="category-icon-wrap">
          <div className="category-icon">🎵</div>
          <p className="category-label">합주실</p>
        </div>
        <div className="category-icon-wrap">
          <div className="category-icon">🎲</div>
          <p className="category-label">보드게임</p>
        </div>
        <div className="category-icon-wrap">
          <div className="category-icon">🎤</div>
          <p className="category-label">노래방</p>
        </div>
      </section>

      <section className="results">
        {searched ? (
          results.length > 0 ? (
            results.map((space) => (
              <div key={space.id} className="card">
                <img src={space.image_url} alt={space.name} />
                <h3>{space.name}</h3>
                <p>위치: {space.location}</p>
                <p>최대 인원: {space.capacity || space.max_capacity || 'N/A'}명</p>
              </div>
            ))
          ) : (
            <p className="no-result">검색 결과가 없습니다.</p>
          )
        ) : (
          <>
            <h2 style={{ textAlign: 'center', width: '100%' }}>추천 공간</h2>
            {results.map((space) => (
              <div key={space.id} className="card">
                <img src={space.image_url} alt={space.name} />
                <h3>{space.name}</h3>
                <p>위치: {space.location}</p>
                <p>최대 인원: {space.capacity || space.max_capacity || 'N/A'}명</p>
              </div>
            ))}
          </>
        )}
      </section>
    </div>
  );
}

export default App;

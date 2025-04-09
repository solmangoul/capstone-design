import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const dummySpaces = [
  { id: 1, title: '홍대 파티룸', category: '파티룸', location: '홍대', capacity: 10, image: 'https://via.placeholder.com/300x200' },
  { id: 2, title: '강남 보드게임룸', category: '보드게임', location: '강남', capacity: 4, image: 'https://via.placeholder.com/300x200' },
  { id: 3, title: '신촌 노래방', category: '노래방', location: '신촌', capacity: 5, image: 'https://via.placeholder.com/300x200' },
  { id: 4, title: '건대 합주실', category: '합주실', location: '건대', capacity: 6, image: 'https://via.placeholder.com/300x200' },
  { id: 5, title: '잠실 보드게임룸', category: '보드게임', location: '잠실', capacity: 2, image: 'https://via.placeholder.com/300x200' },
];

const locations = ['강남', '홍대', '신촌', '건대', '잠실'];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchPage() {
  const query = useQuery();
  const keyword = query.get('query') || '';

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minCapacity, setMinCapacity] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [sort, setSort] = useState('latest');

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleLocationToggle = (loc) => {
    if (selectedLocations.includes(loc)) {
      setSelectedLocations(selectedLocations.filter(l => l !== loc));
    } else {
      setSelectedLocations([...selectedLocations, loc]);
    }
  };

  const applyFilters = (spaces) => {
    let filtered = spaces.filter(
      space =>
        (space.title.includes(keyword) || space.location.includes(keyword)) &&
        (minCapacity === '' || space.capacity >= parseInt(minCapacity)) &&
        (selectedLocations.length === 0 || selectedLocations.includes(space.location))
    );

    switch (sort) {
      case 'name':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'capacity-desc':
        return filtered.sort((a, b) => b.capacity - a.capacity);
      case 'capacity-asc':
        return filtered.sort((a, b) => a.capacity - b.capacity);
      default:
        return filtered.sort((a, b) => b.id - a.id);
    }
  };

  const filteredSpaces = applyFilters(dummySpaces);

  return (
    <div className="results">
      <div className="category-header">
        <h2>"{keyword}" 검색 결과</h2>
        <div className="search-sort-bar">
          <button className="filter-icon" onClick={toggleFilter}>🔍 필터</button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
            <option value="latest">최신순</option>
            <option value="name">이름순</option>
            <option value="capacity-desc">인원 많은 순</option>
            <option value="capacity-asc">인원 적은 순</option>
          </select>
        </div>
      </div>

      {/* 필터 패널 */}
      <div className={`filter-panel ${isFilterOpen ? 'open' : ''}`}>
        <h3>필터 조건 설정</h3>

        <label>최소 인원 수</label>
        <input
          type="number"
          min="1"
          value={minCapacity}
          onChange={(e) => setMinCapacity(e.target.value.replace(/^0+/, ''))}
        />

        <label>지역</label>
        <div className="checkbox-group">
          {locations.map(loc => (
            <label key={loc}>
              <input
                type="checkbox"
                checked={selectedLocations.includes(loc)}
                onChange={() => handleLocationToggle(loc)}
              />
              {loc}
            </label>
          ))}
        </div>

        <button onClick={toggleFilter} className="apply-button">✔ 적용</button>
      </div>

      {/* 결과 카드 */}
      {filteredSpaces.length > 0 ? (
        filteredSpaces.map((space) => (
          <div key={space.id} className="card">
            <img src={space.image} alt={space.title} />
            <h3>{space.title}</h3>
            <p className="category-tag">{space.category} · {space.capacity}명</p>
          </div>
        ))
      ) : (
        <p className="no-result">조건에 맞는 검색 결과가 없습니다.</p>
      )}
    </div>
  );
}

export default SearchPage;

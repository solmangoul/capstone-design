import React, { useState } from 'react';
import axios from 'axios';
import './RecommendPage.css'; // 스타일 분리할 경우

function RecommendPage() {
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    category: '',
    imageUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 나중에 토큰이나 user 정보도 함께 전송 가능
      const res = await axios.post('/api/recommend', form);
      alert('장소가 등록되었습니다!');
      console.log(res.data);
    } catch (err) {
      console.error('장소 등록 실패:', err);
      alert('등록 중 오류 발생');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">장소 추천 등록</h2>

        <form onSubmit={handleSubmit} className="recommend-form">
          <input
            type="text"
            name="name"
            placeholder="장소 이름"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="주소 (예: 서울 강남구)"
            value={form.location}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="카테고리 (예: 보드게임, 파티룸)"
            value={form.category}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="장소 설명"
            value={form.description}
            onChange={handleChange}
            rows={4}
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="이미지 URL (Cloudinary 또는 외부 링크)"
            value={form.imageUrl}
            onChange={handleChange}
          />

          <button type="submit">장소 등록하기</button>
        </form>
      </div>
    </div>
  );
}

export default RecommendPage;

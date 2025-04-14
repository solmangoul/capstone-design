import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/register', form);
      alert('✅ 회원가입 성공!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('❌ 회원가입 실패: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>회원가입</h2>

        <input
          type="text"
          placeholder="이름"
          value={form.username}
          onChange={handleChange('username')}
          required
        />
        <input
          type="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange('email')}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange('password')}
          required
        />

        <button type="submit" className="login-button">
          회원가입
        </button>
        <p style={{ marginTop: '16px' }}>
          이미 계정이 있으신가요?{' '}
          <a href="/login" style={{ color: '#4338ca' }}>
            로그인
          </a>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import CategoryPage from './CategoryPage';
import SearchPage from './SearchPage';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './LoginPage'; // ✅ 로그인 페이지 추가
import bgImage from './assets/bg.png';
import RegisterPage from './RegisterPage';
import './App.css';
import './Responsive.css';


function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div
          className="search-background"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} /> {/* ✅ 로그인 라우트 */}
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

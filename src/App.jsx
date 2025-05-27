import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import CategoryPage from './CategoryPage';
import SearchPage from './SearchPage';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import MyPage from './MyPage';
import RecommendPage from './RecommendPage';
import bgImage from './assets/bg.png';
import './App.css';
import './Responsive.css';

function AppRoutes() {
  const location = useLocation();

  // 특정 경로에만 search-background 적용
  const withBackground = ['/', '/search', '/category'];

  const isBackgroundPage = withBackground.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="app">
      <Header />

      {isBackgroundPage ? (
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/recommend" element={<RecommendPage />} />
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/recommend" element={<RecommendPage />} />
        </Routes>
      )}

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

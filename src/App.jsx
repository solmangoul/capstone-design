import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function PageWithBackground({ children }) {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
}

function AppRoutes() {
  return (
    <div className="app">
      <Header />

      <Routes>
        <Route path="/" element={<PageWithBackground><Home /></PageWithBackground>} />
        <Route path="/category/:name" element={<PageWithBackground><CategoryPage /></PageWithBackground>} />
        <Route path="/search" element={<PageWithBackground><SearchPage /></PageWithBackground>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/recommend" element={<RecommendPage />} />
      </Routes>

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

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import CategoryPage from './CategoryPage';
import SearchPage from './SearchPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Header from './components/Header';
import Footer from './components/Footer';
import bgImage from './assets/bg.png';

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app">
      {!isAuthPage && <Header />}

      {!isAuthPage ? (
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
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      )}

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default AppRoutes;

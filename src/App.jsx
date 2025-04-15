import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes'; // 별도 라우트 컴포넌트로 분리

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { LandingPage } from './pages/LandingPage';
import { AdminPage } from './pages/AdminPage';
import { SharedFuturePage } from './pages/SharedFuturePage';

function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/future/:generationId" element={<SharedFuturePage />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
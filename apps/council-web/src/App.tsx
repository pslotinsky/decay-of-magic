import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { ProtectedRoute } from './components/ProtectedRoute';
import { CardsPage } from './pages/CardsPage';
import { CitizensPage } from './pages/CitizensPage';
import { LoginPage } from './pages/LoginPage';
import { ManaPage } from './pages/ManaPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/citizens"
          element={
            <ProtectedRoute>
              <CitizensPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mana"
          element={
            <ProtectedRoute>
              <ManaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/card"
          element={
            <ProtectedRoute>
              <CardsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/citizens" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

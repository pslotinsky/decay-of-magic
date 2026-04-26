import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { ProtectedRoute } from './components/ProtectedRoute';
import { CitizensPage } from './pages/CitizensPage';
import { LoginPage } from './pages/LoginPage';
import { UniversePage } from './pages/UniversePage';
import { UniversesPage } from './pages/UniversesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/universe"
          element={
            <ProtectedRoute>
              <UniversesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/universe/:id"
          element={
            <ProtectedRoute>
              <UniversePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen"
          element={
            <ProtectedRoute>
              <CitizensPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/universe" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

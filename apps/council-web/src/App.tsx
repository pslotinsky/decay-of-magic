import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { ProtectedRoute } from './components/ProtectedRoute';
import { CitizensPage } from './pages/CitizensPage';
import { CodexCardPage } from './pages/CodexCardPage';
import { CodexElementPage } from './pages/CodexElementPage';
import { CodexFactionPage } from './pages/CodexFactionPage';
import { CodexHeroPage } from './pages/CodexHeroPage';
import { CodexStatPage } from './pages/CodexStatPage';
import { CodexTraitPage } from './pages/CodexTraitPage';
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
          path="/universe/:universeId/codex/element"
          element={
            <ProtectedRoute>
              <CodexElementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/universe/:universeId/codex/faction"
          element={
            <ProtectedRoute>
              <CodexFactionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/universe/:universeId/codex/stat"
          element={
            <ProtectedRoute>
              <CodexStatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/universe/:universeId/codex/trait"
          element={
            <ProtectedRoute>
              <CodexTraitPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/universe/:universeId/codex/card"
          element={
            <ProtectedRoute>
              <CodexCardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/universe/:universeId/codex/hero"
          element={
            <ProtectedRoute>
              <CodexHeroPage />
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

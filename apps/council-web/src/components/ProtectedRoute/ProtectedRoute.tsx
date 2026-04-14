import { Navigate } from 'react-router';

import { useAuth } from '../../context/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { citizen } = useAuth();

  return citizen ? <>{children}</> : <Navigate to="/login" replace />;
}

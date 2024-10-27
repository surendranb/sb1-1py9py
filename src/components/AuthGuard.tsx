import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user } = useStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return <>{children}</>;
}
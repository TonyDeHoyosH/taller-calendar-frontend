import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { token, user, isAuthenticated, setAuth, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    logout: handleLogout,
  };
};

import { LoginForm } from '@/components/LoginForm';
import { useUserStore } from '@/stores/useUserStore';
import { useNavigate } from '@tanstack/react-router';

export function LoginPage() {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  if (user.username) {
    console.log('User found');
    navigate({ to: '/dashboard' });
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-3xl">
        <LoginForm setUser={setUser} className="" />
      </div>
    </div>
  );
}

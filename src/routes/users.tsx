import Header from '@/components/Header';
import { createFileRoute, redirect } from '@tanstack/react-router';
import UsersPage from '@/pages/UsersPage';
import { useUserStore } from '@/stores/useUserStore';

export const Route = createFileRoute('/users')({
  component: RouteComponent,
  beforeLoad: () => {
    const user = useUserStore.getState().user;

    if (!user) {
      throw redirect({
        to: '/login',
      });
    }

    if (user.role === 'SURVEYOR') {
      throw redirect({
        to: '/not-found',
      });
    }
  },
});

function RouteComponent() {
  return (
    <div>
      <Header />
      <UsersPage />
    </div>
  );
}

import Header from '@/components/Header';
import AnalyticsPage from '@/pages/AnalyticsPage';
import { useUserStore } from '@/stores/useUserStore';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/analytics')({
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
      <AnalyticsPage />
    </div>
  );
}

import { createFileRoute, redirect } from '@tanstack/react-router';
import ElectionResultsPage from '@/pages/ElectionResultsPage';
import Header from '@/components/Header';
import { useUserStore } from '@/stores/useUserStore';

export const Route = createFileRoute('/election-results')({
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
    <div className="">
      <Header />
      <ElectionResultsPage />
    </div>
  );
}

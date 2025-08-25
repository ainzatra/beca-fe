import Header from '@/components/Header';
import AnalyticsPage from '@/pages/AnalyticsPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/analytics')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header />
      <AnalyticsPage />
    </div>
  );
}

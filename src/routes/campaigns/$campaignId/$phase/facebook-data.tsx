import { createFileRoute } from '@tanstack/react-router';
import { FacebookDataPage } from '@/pages/FacebookDataPage';
import Header from '@/components/Header';

export const Route = createFileRoute(
  '/campaigns/$campaignId/$phase/facebook-data',
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-6">
      <Header />
      <FacebookDataPage />
    </div>
  );
}

import CampaignsPage from '@/pages/CampaignsPage';
import Header from '@/components/Header';
import { createFileRoute } from '@tanstack/react-router';
import type { Campaign } from '@/components/CampaignCard';

export const Route = createFileRoute('/campaigns/')({
  component: RouteComponent,
});

function RouteComponent() {
  // use tanstack query isntead after creating backend

  return (
    <div className="p-6">
      <Header />
      <CampaignsPage />
    </div>
  );
}

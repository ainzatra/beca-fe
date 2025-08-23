import { createFileRoute } from '@tanstack/react-router';
import CampaignDetailPage from '@/pages/CampaignDetailPage';
import Header from '@/components/Header';

export const Route = createFileRoute('/campaigns/$campaignId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { campaignId } = Route.useParams();
  // Add a tanstack query to fetch the campaign details
  return (
    <div className="">
      <Header />
      <CampaignDetailPage campaignId={campaignId} />
    </div>
  );
}

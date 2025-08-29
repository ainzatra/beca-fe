import { createFileRoute } from '@tanstack/react-router';
import CampaignDetailPage from '@/pages/CampaignDetailPage';
import Header from '@/components/Header';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/utils';

export const Route = createFileRoute('/campaigns/$campaignId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { campaignId } = Route.useParams();
  // Add a tanstack query to fetch the campaign details
  const {
    data: campaign,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const response = await api(`/campaign/${campaignId}`, true);

      return await response.json();
    },
  });
  return (
    <div className="">
      <Header />
      <CampaignDetailPage
        campaign={campaign}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}

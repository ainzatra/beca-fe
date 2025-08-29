import * as React from 'react';
import CampaignCard from '@/components/CampaignCard';
import type { Campaign } from '@/components/CampaignCard';
import CreateCampaignModal, {
  type CreateCampaign,
} from '@/components/CreateCampaignModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/utils';
import { toast } from 'sonner';

export default function CampaignGrid() {
  const queryClient = useQueryClient();
  const {
    data: campaigns = [],
    isLoading,
    isError,
  } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await api('/campaign', true);

      if (!response.ok) {
        toast.error('Error fetching the campaigns');
        throw new Error('Failed to fetch campaigns');
      }

      return await response.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: CreateCampaign) => {
      await api('/campaign', true, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('New campaign created', {
        style: {
          backgroundColor: 'limegreen',
          color: 'white',
        },
      });
    },
  });

  const handleCreate = (payload: CreateCampaign) => {
    mutation.mutate(payload);
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
        </div>

        <div className="flex items-center gap-2">
          <CreateCampaignModal onCreate={handleCreate} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Loading campaigns...</CardTitle>
            </CardHeader>
            <CardContent>Fetching campaigns, please wait.</CardContent>
          </Card>
        ) : isError ? (
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              There was an error loading campaigns. Try refreshing or check your
              connection.
            </CardContent>
          </Card>
        ) : campaigns.length === 0 ? (
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>No campaigns yet</CardTitle>
            </CardHeader>
            <CardContent>
              Start by creating a new campaign using the button above.
            </CardContent>
          </Card>
        ) : (
          campaigns.map((c: Campaign) => (
            <CampaignCard key={c.id} campaign={c} />
          ))
        )}
      </div>
    </Card>
  );
}

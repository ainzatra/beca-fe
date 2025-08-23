import * as React from 'react';
import CampaignCard from '@/components/CampaignCard';
import type { Campaign } from '@/components/CampaignCard';
import CreateCampaignModal from '@/components/CreateCampaignModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CampaignGrid({
  initial = [],
}: {
  initial?: Campaign[];
}) {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>(initial);

  const onCreate = (c: Campaign) => {
    setCampaigns((s) => [c, ...s]);
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
        </div>

        <div className="flex items-center gap-2">
          <CreateCampaignModal onCreate={onCreate} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No campaigns yet</CardTitle>
            </CardHeader>
            <CardContent>
              Start by creating a new campaign using the button above.
            </CardContent>
          </Card>
        ) : (
          campaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)
        )}
      </div>
    </Card>
  );
}

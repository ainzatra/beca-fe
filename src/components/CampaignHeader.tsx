import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Campaign } from '@/components/CampaignCard';
import CampaignManagementSheet from '@/components/CampaignManagementSheet';

export default function CampaignHeader({
  campaign,
  onRunAnalysis,
}: {
  campaign: Campaign;
  onRunAnalysis?: () => void;
}) {
  const created = campaign.createdAt
    ? new Date(campaign.createdAt).toLocaleString()
    : '—';

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">{campaign.title}</h2>
              <Badge
                variant={
                  campaign.status === 'active'
                    ? 'default'
                    : campaign.status === 'completed'
                      ? 'secondary'
                      : undefined
                }
                className="capitalize"
              >
                {campaign.status.toUpperCase()}
              </Badge>
            </div>
            <CardDescription className="mt-2 text-sm text-muted-foreground">
              {campaign.description ?? 'No description provided'}
            </CardDescription>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="text-xs text-muted-foreground">
              Created: <span className="font-medium">{created}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Phases complete:{' '}
              <span className="font-medium">
                {campaign.phasesCompleted ?? 0}/3
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-start gap-2">
                <CampaignManagementSheet campaign={campaign} />
              </div>

              <Button
                size="sm"
                variant="default"
                className="bg-emerald-500 text-white"
                onClick={onRunAnalysis}
              >
                🔮 Run Analysis
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-muted-foreground">
          Quick actions and metadata are shown on the right. Use "Run Analysis"
          to trigger prescriptive AI when enough responses are available.
        </div>
      </CardContent>

      <CardFooter />
    </Card>
  );
}

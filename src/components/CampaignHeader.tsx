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
import { checkPhasesCompleted } from '@/utils/utils';
import type { CampaignDetails } from '@/pages/CampaignDetailPage';
import { useUserStore } from '@/stores/useUserStore';

export default function CampaignHeader({
  campaign,
}: {
  campaign: CampaignDetails;
}) {
  const created = campaign.createdAt
    ? new Date(campaign.createdAt).toLocaleString()
    : '—';

  const { user } = useUserStore();
  const isSurveyor = user?.role === 'SURVEYOR';

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">{campaign.title}</h2>
              <Badge
                variant="default"
                className={`capitalize ${
                  campaign.status === 'ACTIVE'
                    ? 'bg-green-500'
                    : campaign.status === 'COMPLETED'
                      ? 'bg-primary'
                      : 'bg-slate-500'
                }`}
              >
                {campaign.status.toUpperCase()}
              </Badge>
            </div>
            <CardDescription className="mt-2 text-sm text-muted-foreground">
              {campaign.description ?? 'No description provided'}
            </CardDescription>

            {(campaign.candidateName ||
              campaign.candidatePosition ||
              campaign.candidateParty ||
              campaign.fbUrl) && (
              <div className="mt-4 space-y-1">
                {campaign.candidateName && (
                  <div className="text-sm">
                    <span className="font-medium">Candidate:</span>{' '}
                    {campaign.candidateName}
                  </div>
                )}
                {campaign.candidatePosition && (
                  <div className="text-sm">
                    <span className="font-medium">Position:</span>{' '}
                    {campaign.candidatePosition
                      .split(' ')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(' ')}
                  </div>
                )}
                {campaign.candidateParty && (
                  <div className="text-sm">
                    <span className="font-medium">Party:</span>{' '}
                    {campaign.candidateParty}
                  </div>
                )}
                {campaign.fbUrl && (
                  <div className="text-sm">
                    <span className="font-medium">Facebook:</span>{' '}
                    <a
                      href={campaign.fbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {campaign.fbUrl}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="text-xs text-muted-foreground">
              Created: <span className="font-medium">{created}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Phases complete:{' '}
              <span className="font-medium">
                {checkPhasesCompleted(campaign.activePhase, campaign.status)}/3
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-start gap-2">
                {checkPhasesCompleted(campaign.activePhase, campaign.status) !==
                  3 &&
                  !isSurveyor && (
                    <CampaignManagementSheet campaign={campaign} />
                  )}
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

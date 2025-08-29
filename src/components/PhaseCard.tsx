import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { Link } from '@tanstack/react-router';
import type { PhaseTotals } from '@/pages/CampaignDetailPage';
import type { CampaignPhase } from './CampaignCard';
import { Badge } from './ui/badge';

export type PhaseStatus = 'active' | 'inactive';

interface PhaseCardProps {
  status: PhaseStatus;
  total: PhaseTotals;
  phase: CampaignPhase;
}

export default function PhaseCard({ status, total, phase }: PhaseCardProps) {
  const statusColor =
    status === 'active'
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-slate-100 text-slate-700';
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium">{`${phase}-CAMPAIGN`}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Surveys: <span className="font-semibold">{total.surveys}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Responses:{' '}
              <span className="font-semibold">{total.responses}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge
              variant={'default'}
              className={`${
                status === 'active' ? 'bg-primary' : 'bg-slate-500'
              }`}
            >
              {status.toUpperCase()}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardFooter className="flex gap-2 flex-wrap">
        <Link to="$phase/survey" params={{ phase }} className="inline-block">
          <Button size="sm" variant="outline">
            Edit Survey
          </Button>
        </Link>

        <Link to="." className="inline-block ml-auto">
          <Button size="sm" variant="ghost">
            View Responses
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

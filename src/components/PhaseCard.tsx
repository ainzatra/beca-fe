import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

export type PhaseStatus = 'draft' | 'active' | 'completed';

export default function PhaseCard({
  campaignId,
  phaseId,
  title,
  status,
  responses,
}: {
  campaignId: string;
  phaseId: string;
  title: string;
  status: PhaseStatus;
  responses: number;
}) {
  const statusColor =
    status === 'active'
      ? 'bg-emerald-100 text-emerald-800'
      : status === 'completed'
        ? 'bg-violet-100 text-violet-800'
        : 'bg-slate-100 text-slate-700';

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium">{title}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Responses: <span className="font-semibold">{responses}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                statusColor,
              )}
            >
              {status.toUpperCase()}
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          Survey status and quick actions. Open the survey builder to edit
          questions or view respondent data.
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 flex-wrap">
        <Link
          to="/campaigns/$campaignId/phases/$phaseId/survey"
          params={{ phaseId, campaignId }}
          className="inline-block"
        >
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

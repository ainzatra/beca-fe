import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

type CampaignStatus = 'active' | 'completed' | 'draft';

export type Campaign = {
  id: string;
  title: string;
  status: CampaignStatus;
  createdAt?: string;
  phasesCompleted?: number; // 0..3
  description?: string;
};

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = Math.max(0, Math.min(3, campaign.phasesCompleted ?? 0));
  const percent = Math.round((progress / 3) * 100);

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4 flex-wrap">
          <span className="truncate text-wrap">{campaign.title}</span>
          <span className="text-xs text-muted-foreground capitalize">
            {campaign.status}
          </span>
        </CardTitle>
        <CardDescription className="mt-1">
          {campaign.description ?? 'No description provided'}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 mt-auto">
        <div className="text-sm text-muted-foreground">
          Created{' '}
          {campaign.createdAt
            ? new Date(campaign.createdAt).toLocaleDateString()
            : '—'}
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="text-xs text-muted-foreground">Phases complete</div>
            <div className="font-medium">{progress}/3</div>
          </div>

          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
              style={{ width: `${percent}%` }}
              aria-hidden
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to={campaign.id}
            className="inline-block"
            aria-label={`Open campaign ${campaign.title}`}
          >
            <Button size="sm" variant="outline">
              Open
            </Button>
          </Link>
          <Button size="sm" variant="ghost">
            Duplicate
          </Button>
        </div>

        <div className="ml-auto text-xs text-muted-foreground">
          {percent}% complete
        </div>
      </CardFooter>
    </Card>
  );
}

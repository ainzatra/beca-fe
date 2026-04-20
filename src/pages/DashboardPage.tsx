import * as React from 'react';
import PrescriptivePanel from '@/components/PrescriptivePanel';
import StatCard from '@/components/StatCard';
import { ProgressCard } from '@/components/ProgressCard';
import AnalyticsStats from '@/components/AnalyticsStats';
import type { AnalyticsData } from '@/components/AnalyticsStats';
import CampaignCard from '@/components/CampaignCard';
import type { Campaign } from '@/components/CampaignCard';
import CreateCampaignModal, {
  type CreateCampaign,
} from '@/components/CreateCampaignModal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { api } from '@/utils/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/useUserStore';

export function DashboardPage() {
  // Replace these with real data hooks (TanStack Query) later.
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const isSurveyor = user?.role === 'SURVEYOR';
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
  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api('/campaign/dashboard', true);

      if (!response.ok) {
        toast.error('Error fetching the campaigns');
        throw new Error('Failed to fetch campaigns');
      }

      return await response.json();
    },
    refetchOnMount: 'always',
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

  const analytics: AnalyticsData = {
    totalResponses: 175,
    positive: 88,
    neutral: 52,
    negative: 35,
    confidence: 78,
    topIssues: [],
  };

  // const stats = {
  //   totalCampaigns: campaigns.length,
  //   totalResponses: analytics.totalResponses,
  //   surveyors: 12, // mock - replace with real
  // };

  return (
    <div className="bg-white rounded-xl p-4 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview across all campaigns and survey activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSurveyor ? (
            <Button variant="default" className="whitespace-nowrap" disabled>
              Create New Campaign
            </Button>
          ) : (
            <CreateCampaignModal onCreate={handleCreate} />
          )}
          <Link to="/campaigns" className="inline-block">
            <Button size="sm" variant="outline">
              View all campaigns
            </Button>
          </Link>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          value={stats?.campaignCount.total}
          title="Total Campaigns"
          subtitle={<div className="text-xs">Active, draft and completed</div>}
          accentColor="blue"
        />

        <StatCard
          value={stats?.responseCount}
          title="Total Responses"
          subtitle={<div className="text-xs">Across all campaigns</div>}
          accentColor="violet"
        />

        <StatCard
          value={stats?.surveyorCount}
          title="Active Surveyors"
          subtitle={<div className="text-xs">Field enumerators online</div>}
          accentColor="emerald"
        />
      </div>

      {/* Two-column main area: Recent campaigns + Analytics summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>
              Quick access to the most recent campaigns and their progress
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.slice(0, 4).map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          </CardContent>

          {/* <CardFooter>
            <div className="flex items-center gap-2">
              <Link to="/campaigns" className="inline-block">
                <Button size="sm">Manage campaigns</Button>
              </Link>
              <div className="ml-auto text-xs text-muted-foreground">
                Showing {Math.min(4, campaigns.length)} of {campaigns.length}
              </div>
            </div>
          </CardFooter> */}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phase progress (all campaigns)</CardTitle>
            <CardDescription>
              High-level sentiment and response metrics
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* <AnalyticsStats data={analytics} /> */}

            <div className="mt-4">
              <div className="grid grid-cols-1 gap-2">
                <ProgressCard
                  title="Pre-Campaign"
                  count={stats?.campaignCount.PRE}
                />
                <ProgressCard
                  title="Mid-Campaign"
                  count={stats?.campaignCount.MID}
                />
                <ProgressCard
                  title="Post-Campaign"
                  count={stats?.campaignCount.POST}
                />
              </div>
            </div>
          </CardContent>

          {/* <CardFooter>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                Open Analytics
              </Button>
              <Button size="sm" className="ml-auto">
                Export snapshot
              </Button>
            </div>
          </CardFooter> */}
        </Card>
      </div>

      {/* <PrescriptivePanel /> */}

      {/* <Card>
        <CardHeader>
          <CardTitle>💬 Live Updates</CardTitle>
          <CardDescription>Recent activity across campaigns</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Last Survey</div>
              <div className="font-medium">Carmen Lopez — Pre-Campaign</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Today's Total</div>
              <div className="font-medium">12</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">This Week</div>
              <div className="font-medium">84</div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex gap-3">
            <Button size="sm" variant="ghost">
              Export CSV
            </Button>
            <Button size="sm" variant="outline">
              Open Reports
            </Button>
          </div>
        </CardFooter>
      </Card> */}
    </div>
  );
}

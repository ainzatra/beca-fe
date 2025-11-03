import { useEffect, useState } from 'react';
import PrescriptivePanel from '@/components/PrescriptivePanel';
import AnalyticsHeader from '@/components/AnalyticsHeader';
import AnalyticsStats from '@/components/AnalyticsStats';
import SummaryPanel from '@/components/SummaryPanel';
import SentimentTrend from '@/components/SentimentTrend';
import BarangayRecommendations from '@/components/BarangayRecommendations';
import IssuesTable, { type Issue } from '@/components/IssuesTable';
import LocationSentimentChart, {
  type LocationSentimentDatum,
} from '@/components/LocationSentimentChart';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/utils/utils';
import { toast } from 'sonner';
import type { CampaignPhase } from '@/components/CampaignCard';

type AnalyticsData = {
  id: string;
  campaignId: string;
  phase: CampaignPhase;
  report: {
    summary: string;
    totalResponses: number;
    positive: number;
    neutral: number;
    negative: number;
    confidence: number;
    topIssues: Issue[];
    locationSentiment: LocationSentimentDatum[];
    recommendations?: Array<{
      barangay: string;
      recommendation: string;
      priority: 'HIGH' | 'MEDIUM' | 'LOW';
      sentimentScore: number;
      historicalPerformance: string;
      keyIssues: string[];
      responseCount: number;
    }>;
  };
};

export default function AnalyticsPage() {
  const { data: campaigns, isLoading: campaignLoading } = useQuery({
    queryKey: ['campaign-key'],
    queryFn: async () => {
      const response = await api(`/campaign`, true);

      if (!response.ok) {
        toast.error('Error fetching the campaigns');
        throw new Error('Failed to fetch campaigns');
      }

      return await response.json();
    },
  });
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30');
  const [compareMode, setCompareMode] = useState(false);
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics', selectedCampaign],
    queryFn: async () => {
      const response = await api(
        `/campaign/analysis/${selectedCampaign}`,
        true,
      );

      if (!response.ok) {
        toast.error('Error fetching analytics');
        throw new Error('Failed to fetch analytics');
      }

      return await response.json();
    },
    enabled: !!selectedCampaign,
  });

  useEffect(() => {
    if (campaigns && campaigns.length > 0 && !selectedCampaign) {
      setSelectedCampaign(campaigns[0].id);
    }
  }, [campaigns, selectedCampaign]);

  const isLoading = campaignLoading || analyticsLoading;

  // Sample data for location sentiment (add to API response later)
  const locationSentiment = [
    { location: 'Barangay 1', positive: 45, neutral: 20, negative: 10 },
    { location: 'Barangay 2', positive: 30, neutral: 25, negative: 20 },
    { location: 'Barangay 3', positive: 12, neutral: 8, negative: 25 },
    { location: 'Barangay 4', positive: 20, neutral: 15, negative: 12 },
    { location: 'Barangay 5', positive: 8, neutral: 10, negative: 5 },
  ];

  // Optional chart color/label config — passed to the shadcn ChartContainer wrapper
  const chartConfig = {
    positive: { label: 'Positive', color: '#10B981' },
    neutral: { label: 'Neutral', color: '#F59E0B' },
    negative: { label: 'Negative', color: '#EF4444' },
  };

  const onExport = () => {
    // placeholder export behavior
    console.log('Exporting analytics for', selectedCampaign, dateRange);
    // implement CSV/PDF export later
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-4 space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center space-y-2 mb-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Grid panels skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Skeleton className="h-32 w-full" /> {/* Summary */}
          <Skeleton className="h-64 w-full" /> {/* Location Chart */}
          <Skeleton className="h-64 w-full" /> {/* Trend */}
          <Skeleton className="h-64 w-full" /> {/* Breakdown */}
        </div>

        {/* Table skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="border rounded-md">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const currentAnalytics: AnalyticsData = analytics?.[0] || {
    id: '',
    campaignId: selectedCampaign || '',
    phase: 'pre' as CampaignPhase,
    report: {
      summary: '',
      totalResponses: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
      confidence: 0,
      topIssues: [],
      locationSentiment: [],
    },
  };

  const analyticsArray = analytics || [];

  return (
    <div className="bg-white rounded-xl p-4 space-y-6">
      <AnalyticsHeader
        campaigns={campaigns}
        selectedCampaign={selectedCampaign ?? ''}
        setSelectedCampaign={setSelectedCampaign}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onExport={onExport}
      />
      <>
        <AnalyticsStats data={currentAnalytics} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SummaryPanel
            data={{ summary: currentAnalytics.report.summary || '' }}
          />
          <LocationSentimentChart
            data={currentAnalytics.report.locationSentiment}
            config={chartConfig}
          />
          <SentimentTrend data={analyticsArray} />
          <BarangayRecommendations data={currentAnalytics} />
        </div>

        <IssuesTable issues={currentAnalytics.report.topIssues || []} />
      </>
      {/* <PrescriptivePanel /> */}
    </div>
  );
}

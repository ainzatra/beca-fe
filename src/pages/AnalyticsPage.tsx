import { useState } from 'react';
import PrescriptivePanel from '@/components/PrescriptivePanel';
import AnalyticsHeader from '@/components/AnalyticsHeader';
import AnalyticsStats from '@/components/AnalyticsStats';
import SummaryPanel from '@/components/SummaryPanel';
import SentimentTrend from '@/components/SentimentTrend';
import SentimentBreakdown from '@/components/SentimentBreakdown';
import IssuesTable, { type Issue } from '@/components/IssuesTable';
import LocationSentimentChart from '@/components/LocationSentimentChart';

type AnalyticsData = {
  summary: string;
  totalResponses: number;
  positive: number;
  neutral: number;
  negative: number;
  confidence: number;
  lastSurveyName: string;
  phase: string;
  topIssues: Issue[];
};

export default function AnalyticsPage() {
  const [selectedCampaign, setSelectedCampaign] = useState('campaign-1');
  const [dateRange, setDateRange] = useState('30');

  // Replace with the actual API Response from backend
  const campaigns = [
    { id: 'campaign-1', title: 'Campaign 1' },
    { id: 'campaign-2', title: 'Campaign 2' },
  ];

  // Sample analytics data (replace with real API response)
  const data: AnalyticsData = {
    summary: `The campaign shows strong performance with 175 total responses yielding 50% positive sentiment and steadily increasing public support over time, particularly in Barangay 1. While infrastructure messaging is resonating well with 98 positive mentions, healthcare affordability has emerged as the primary concern with 124 negative mentions and an upward trend. Current data indicates a 50% probability of campaign success, with momentum building favorably, but immediate attention to healthcare messaging is critical while maintaining the successful infrastructure communications approach.`,
    totalResponses: 175,
    positive: 88,
    neutral: 52,
    negative: 35,
    confidence: 78,
    lastSurveyName: 'Pre-Campaign — Carmen Lopez',
    phase: 'Pre-Campaign',
    topIssues: [
      {
        issue: 'Healthcare affordability',
        sentiment: 'Negative',
        mentions: 124,
        trend: 'up',
      },
      {
        issue: 'Infrastructure',
        sentiment: 'Positive',
        mentions: 98,
        trend: 'down',
      },
      {
        issue: 'Education',
        sentiment: 'Neutral',
        mentions: 72,
        trend: 'flat',
      },
    ],
  };

  // Replace with the actual API Response from backend
  // Sample data for the location sentiment chart (region / municipality / barangay)
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

  return (
    <div className="bg-white rounded-xl p-4 space-y-6">
      <AnalyticsHeader
        campaigns={campaigns}
        selectedCampaign={selectedCampaign}
        setSelectedCampaign={setSelectedCampaign}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onExport={onExport}
      />

      <AnalyticsStats data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SummaryPanel data={data} />
        <LocationSentimentChart data={locationSentiment} config={chartConfig} />
        <SentimentTrend data={data} />
        <SentimentBreakdown data={data} />
      </div>

      <IssuesTable issues={data.topIssues} />

      {/* <PrescriptivePanel /> */}
    </div>
  );
}

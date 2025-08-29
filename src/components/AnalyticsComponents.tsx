import React from 'react';
import { useState } from 'react';
import StatCard from '@/components/StatCard';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartTooltip,
  ChartLegend,
} from '@/components/ui/chart';

export type Issue = {
  issue: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  mentions: number;
  trend: 'up' | 'down' | 'flat';
};

export type AnalyticsData = {
  totalResponses: number;
  positive: number;
  neutral: number;
  negative: number;
  confidence: number;
  topIssues: Issue[];
  lastSurveyName?: string;
  phase?: string;
};

/**
 * AnalyticsHeader
 * - campaign selector
 * - date range selector
 * - export button
 */
export function AnalyticsHeader({
  campaigns,
  selectedCampaign,
  setSelectedCampaign,
  dateRange,
  setDateRange,
  onExport,
}: {
  campaigns: { id: string; title: string }[];
  selectedCampaign: string;
  setSelectedCampaign: (id: string) => void;
  dateRange: string;
  setDateRange: (r: string) => void;
  onExport?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="flex items-center gap-2">
        <Select
          value={selectedCampaign}
          onValueChange={(v) => setSelectedCampaign(v)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Campaigns" />
          </SelectTrigger>
          <SelectContent>
            {campaigns.map((c) => (
              <SelectItem value={c.id} key={c.id}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={(v) => setDateRange(v)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Last 30d" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7d</SelectItem>
            <SelectItem value="30">Last 30d</SelectItem>
            <SelectItem value="90">Last 90d</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="default" size="sm" onClick={onExport}>
          Export
        </Button>
      </div>
    </div>
  );
}

/**
 * AnalyticsStats
 * shows top-line metric cards
 */
export function AnalyticsStats({ data }: { data: AnalyticsData }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        value={data.totalResponses}
        title="Total Responses123"
        subtitle={<div className="text-xs">Across selected campaign</div>}
        className="bg-gradient-to-br from-red-700 to-emerald-500"
      />

      <StatCard
        value={data.positive}
        title="Positive Sentiment"
        subtitle={<div className="text-xs">Based on AI sentiment</div>}
        className="bg-gradient-to-br from-emerald-600 to-emerald-400"
      />

      <StatCard
        value={data.negative}
        title="Negative Sentiment"
        subtitle={<div className="text-xs">Issues & concerns</div>}
        className="bg-gradient-to-br from-red-600 to-rose-500"
      />
    </div>
  );
}

/**
 * SummaryPanel
 * Generates a natural-language summary of the analytics data
 */
export function SummaryPanel({ data }: { data: AnalyticsData }) {
  // Derive percentages safely
  const total = Math.max(1, data.totalResponses);
  const positivePct = Math.round((data.positive / total) * 100);
  const neutralPct = Math.round((data.neutral / total) * 100);
  const negativePct = Math.round((data.negative / total) * 100);

  const topIssues =
    data.topIssues && data.topIssues.length > 0
      ? data.topIssues
          .slice(0, 3)
          .map((i) => i.issue)
          .join(', ')
      : 'no prominent issues detected';

  const summary = `In the selected scope there are ${data.totalResponses} responses. Sentiment is ${positivePct}% positive, ${neutralPct}% neutral, and ${negativePct}% negative. Top issues are ${topIssues}. Confidence level for these insights is approximately ${data.confidence}%.`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>Summary for quick reading</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">{summary}</p>

        <div className="mt-3 text-xs text-muted-foreground grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-muted-foreground">Data confidence</div>
            <div className="font-medium">{data.confidence}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Last survey</div>
            <div className="font-medium">{data.lastSurveyName ?? '—'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * SentimentTrend - renders a line chart for sentiment across phases.
 *
 * Note: the current AnalyticsData shape is aggregated. This component
 * uses a small local/mock series and appends the latest aggregated data
 * as the final point. Replace trendData with real series data when it
 * becomes available from the backend / query.
 */
export function SentimentTrend({ data }: { data: AnalyticsData }) {
  type TrendDatum = {
    phase: string;
    positive: number;
    neutral: number;
    negative: number;
  };

  const trendData: TrendDatum[] = [
    { phase: 'Pre-Campaign', positive: 30, neutral: 40, negative: 30 },
    { phase: 'Launch', positive: 45, neutral: 30, negative: 25 },
    { phase: 'Mid-Campaign', positive: 40, neutral: 38, negative: 22 },
    {
      phase: data.phase ?? 'Latest',
      positive: data.positive,
      neutral: data.neutral,
      negative: data.negative,
    },
  ];

  const mergedConfig = {
    positive: { label: 'Positive', color: '#10B981' },
    neutral: { label: 'Neutral', color: '#F59E0B' },
    negative: { label: 'Negative', color: '#EF4444' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Trend</CardTitle>
        <CardDescription>Line chart of sentiment across phases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ChartContainer config={mergedConfig} className="h-full w-full">
            <LineChart accessibilityLayer data={trendData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="phase" tickLine={false} axisLine={false} />
              <YAxis />
              <Line
                type="monotone"
                dataKey="positive"
                stroke="var(--color-positive)"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="neutral"
                stroke="var(--color-neutral)"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="negative"
                stroke="var(--color-negative)"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * SentimentBreakdown - placeholder for pie/bar charts
 */
export function SentimentBreakdown({ data }: { data: AnalyticsData }) {
  const total = Math.max(1, data.totalResponses);
  const positivePct = Math.round((data.positive / total) * 100);
  const neutralPct = Math.round((data.neutral / total) * 100);
  const negativePct = Math.round((data.negative / total) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Breakdown</CardTitle>
        <CardDescription>
          Positive / Neutral / Negative distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-around h-48">
          <div className="text-center">
            <div className="text-lg font-semibold">{positivePct}%</div>
            <div className="text-xs text-muted-foreground">Positive</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{neutralPct}%</div>
            <div className="text-xs text-muted-foreground">Neutral</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{negativePct}%</div>
            <div className="text-xs text-muted-foreground">Negative</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * GeographicHeatmap - placeholder for map visualization
 */
export function GeographicHeatmap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Heatmap</CardTitle>
        <CardDescription>Sentiment by region</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48 bg-slate-50 rounded-md border flex items-center justify-center text-muted-foreground">
          Heatmap placeholder (replace with map)
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * IssuesTable - shows top issues (table)
 */
export function IssuesTable({ issues }: { issues: Issue[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Issues & Performance</CardTitle>
        <CardDescription>
          Issues identified by AI and engagement metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Issue</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Mentions</TableHead>
              <TableHead>Trend</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {issues.map((it) => (
              <TableRow key={it.issue}>
                <TableCell>{it.issue}</TableCell>
                <TableCell>{it.sentiment}</TableCell>
                <TableCell>{it.mentions}</TableCell>
                <TableCell>
                  {it.trend === 'up' ? '⬆️' : it.trend === 'down' ? '⬇️' : '→'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-muted-foreground">
            Data confidence: TBD
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              Download PDF
            </Button>
            <Button variant="default" size="sm">
              Schedule Report
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

/**
 * Small helper hook to provide mock analytics data (acts like a query)
 */
export function useMockAnalytics() {
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [dateRange, setDateRange] = useState('30');

  // Mocked data: replace with TanStack Query + API calls later
  const [data] = useState<AnalyticsData>({
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
      { issue: 'Education', sentiment: 'Neutral', mentions: 72, trend: 'flat' },
    ],
  });

  const campaigns = [
    { id: 'all', title: 'All Campaigns' },
    { id: 'campaign-1', title: 'Campaign 1' },
    { id: 'campaign-2', title: 'Campaign 2' },
  ];

  return {
    campaigns,
    selectedCampaign,
    setSelectedCampaign,
    dateRange,
    setDateRange,
    data,
  };
}

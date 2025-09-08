import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartTooltip,
  ChartLegend,
} from '@/components/ui/chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export type AnalyticsData = {
  positive: number;
  neutral: number;
  negative: number;
  phase?: string;
};

export default function SentimentTrend({ data }: { data: AnalyticsData }) {
  type TrendDatum = {
    phase: string;
    positive: number;
    neutral: number;
    negative: number;
  };

  const trendData: TrendDatum[] = [
    { phase: 'Pre-Campaign', positive: 30, neutral: 40, negative: 30 },
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

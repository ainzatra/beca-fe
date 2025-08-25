import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartTooltip,
  ChartLegend,
} from '@/components/ui/chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export type LocationSentimentDatum = {
  location: string;
  positive: number;
  neutral: number;
  negative: number;
};

export type LocationSentimentChartProps = {
  data: LocationSentimentDatum[];
  // the chart "config" maps keys like "positive" to color/label (see ui/chart.ChartConfig)
  config?: Record<
    string,
    {
      label?: React.ReactNode;
      color?: string;
    }
  >;
};

export default function LocationSentimentChart({
  data,
  config,
}: LocationSentimentChartProps) {
  const mergedConfig = config ?? {
    positive: { label: 'Positive', color: '#10B981' }, // emerald-500
    neutral: { label: 'Neutral', color: '#F59E0B' }, // amber-500
    negative: { label: 'Negative', color: '#EF4444' }, // red-500
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment by Location</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-48">
          <ChartContainer config={mergedConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="location"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <Bar dataKey="positive" fill="var(--color-positive)" radius={4} />
              <Bar dataKey="neutral" fill="var(--color-neutral)" radius={4} />
              <Bar dataKey="negative" fill="var(--color-negative)" radius={4} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

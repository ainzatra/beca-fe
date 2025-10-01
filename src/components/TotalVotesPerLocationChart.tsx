import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import { COLORS, type TotalVotesChartProps } from './ElectionShared';

function TotalVotesPerLocationChart({ votes }: TotalVotesChartProps) {
  const locationTotals = Object.entries(votes).map(
    ([location, locationVotes]) => ({
      location,
      totalVotes: Object.values(locationVotes).reduce(
        (sum, voteCount) => sum + voteCount,
        0,
      ),
    }),
  );

  locationTotals.sort((a, b) => b.totalVotes - a.totalVotes);

  const chartConfig = {
    totalVotes: {
      label: 'Total Votes',
      color: '#8884d8',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Votes Per Location</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={locationTotals}>
            <XAxis dataKey="location" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="totalVotes">
              {locationTotals.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default TotalVotesPerLocationChart;

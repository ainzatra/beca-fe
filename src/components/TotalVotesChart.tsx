import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import {
  COLORS,
  formatCandidateName,
  type TotalVotesChartProps,
} from './ElectionShared';
import { useIsMobile } from '@/hooks/use-mobile';

function TotalVotesChart({ votes }: TotalVotesChartProps) {
  const isMobile = useIsMobile();

  const totalVotes = Object.values(votes).reduce(
    (totals, locationVotes) => {
      Object.entries(locationVotes).forEach(([candidate, voteCount]) => {
        totals[candidate] = (totals[candidate] || 0) + voteCount;
      });
      return totals;
    },
    {} as Record<string, number>,
  );

  const chartData = Object.entries(totalVotes)
    .map(([candidate, votes]) => ({
      candidate: formatCandidateName(candidate),
      votes,
    }))
    .sort((a, b) => b.votes - a.votes);

  const chartConfig = {
    votes: {
      label: 'Votes',
      color: '#8884d8',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Votes Per Candidate</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className={isMobile ? 'h-96 w-full' : 'h-80 w-full'}
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="votes"
              nameKey="candidate"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 70 : 100}
              fill="#8884d8"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend
              layout={isMobile ? 'horizontal' : undefined}
              verticalAlign={isMobile ? 'bottom' : undefined}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default TotalVotesChart;

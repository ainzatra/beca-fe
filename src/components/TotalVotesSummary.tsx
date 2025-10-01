import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type TotalVotesChartProps } from './ElectionShared';

function TotalVotesSummary({ votes }: TotalVotesChartProps) {
  const totalVotes = Object.values(votes).reduce((totals, locationVotes) => {
    Object.values(locationVotes).forEach((voteCount) => {
      totals += voteCount;
    });
    return totals;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Votes Cast</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{totalVotes.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}

export default TotalVotesSummary;

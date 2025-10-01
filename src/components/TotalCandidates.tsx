import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type TotalVotesChartProps } from './ElectionShared';

function TotalCandidates({ votes }: TotalVotesChartProps) {
  const totalCandidates = Object.values(votes).reduce(
    (candidates, locationVotes) => {
      Object.keys(locationVotes).forEach((candidate) => {
        candidates.add(candidate);
      });
      return candidates;
    },
    new Set<string>(),
  ).size;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Candidates</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{totalCandidates}</p>
      </CardContent>
    </Card>
  );
}

export default TotalCandidates;

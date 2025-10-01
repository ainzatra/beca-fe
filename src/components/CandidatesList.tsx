import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  formatCandidateName,
  type TotalVotesChartProps,
} from './ElectionShared';

function CandidatesList({ votes }: TotalVotesChartProps) {
  const totalVotes = Object.values(votes).reduce(
    (totals, locationVotes) => {
      Object.entries(locationVotes).forEach(([candidate, voteCount]) => {
        totals[candidate] = (totals[candidate] || 0) + voteCount;
      });
      return totals;
    },
    {} as Record<string, number>,
  );

  const candidates = Object.entries(totalVotes)
    .map(([candidate, votes]) => ({
      candidate: formatCandidateName(candidate),
      votes,
    }))
    .sort((a, b) => b.votes - a.votes);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboards</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead className="text-right">Votes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((item) => (
              <TableRow key={item.candidate}>
                <TableCell>{item.candidate}</TableCell>
                <TableCell className="text-right">
                  {item.votes.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default CandidatesList;

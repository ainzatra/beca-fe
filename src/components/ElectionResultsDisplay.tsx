import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/utils/utils';
import { toast } from 'sonner';
import {
  type ElectionData,
  type ElectionResultsDisplayProps,
} from './ElectionShared';
import VotesPerLocationChart from './VotesPerLocationChart';
import TotalVotesChart from './TotalVotesChart';
import TotalVotesSummary from './TotalVotesSummary';
import TotalCandidates from './TotalCandidates';
import CandidatesList from './CandidatesList';
import TotalVotesPerLocationChart from './TotalVotesPerLocationChart';

function ElectionResultsDisplay({
  position,
  year,
}: ElectionResultsDisplayProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['election-results', position, year],
    queryFn: async () => {
      const response = await api(
        `/llm/history?position=${position}&year=${year}`,
        true,
      );
      if (!response.ok) {
        toast.error('Error fetching election data');
        throw new Error('Failed to fetch election data');
      }
      return response.json() as Promise<ElectionData[]>;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">
            Error loading election data. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            No election data available for the selected position and year.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Take the latest entry
  const latestData = data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];
  const votes = latestData.json.votes;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <TotalVotesSummary votes={votes} />
        <TotalCandidates votes={votes} />
      </div>
      <CandidatesList votes={votes} />
      <TotalVotesChart votes={votes} />
      <TotalVotesPerLocationChart votes={votes} />
      <VotesPerLocationChart votes={votes} />
    </div>
  );
}

export default ElectionResultsDisplay;

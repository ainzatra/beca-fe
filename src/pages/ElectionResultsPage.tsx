import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ElectionControls from '@/components/ElectionControls';
import ElectionResultsDisplay from '@/components/ElectionResultsDisplay';
import UploadVotesSheet from '@/components/UploadVotesSheet';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { api } from '@/utils/utils';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { type ElectionData } from '@/components/ElectionShared';

export default function ElectionResultsPage() {
  const [position, setPosition] = useState('mayor');
  const [year, setYear] = useState('2025');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: electionData } = useQuery({
    queryKey: ['election-results', position, year],
    queryFn: async () => {
      const response = await api(
        `/llm/history?position=${position}&year=${year}`,
        true,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch election data');
      }
      return response.json() as Promise<ElectionData[]>;
    },
  });

  const latestData = electionData?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];
  const latestId = latestData?.id;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!latestId) throw new Error('No data to delete');
      const response = await api(
        `/llm/history/${latestId}?year=${year}&position=${position}`,
        true,
        { method: 'DELETE' },
      );
      if (!response.ok) {
        throw new Error('Failed to delete');
      }
      return response;
    },
    onSuccess: () => {
      toast.success('Election data deleted successfully');
      queryClient.invalidateQueries({
        queryKey: ['election-results', position, year],
      });
    },
    onError: () => {
      toast.error('Failed to delete election data');
    },
  });

  return (
    <div className="bg-white rounded-xl p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end space-y-4">
        <ElectionControls
          position={position}
          year={year}
          onPositionChange={setPosition}
          onYearChange={setYear}
        />
        <div className="flex gap-2">
          <UploadVotesSheet />
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={!latestId || deleteMutation.isPending}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Election Data</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the election data for{' '}
                  {position
                    .split(' ')
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase(),
                    )
                    .join(' ')}{' '}
                  in {year}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    deleteMutation.mutate();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <ElectionResultsDisplay position={position} year={year} />
    </div>
  );
}

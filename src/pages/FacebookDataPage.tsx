import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FacebookPostCard } from '@/components/FacebookPostCard';
import { api } from '@/utils/utils';
import type { FacebookPost } from '@/types/facebook';

export function FacebookDataPage() {
  const { campaignId, phase } = useParams({
    from: '/campaigns/$campaignId/$phase/facebook-data',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['facebook-data', campaignId, phase],
    queryFn: async (): Promise<FacebookPost[]> => {
      const response = await api(
        `/facebook/posts-comments?campaignId=${campaignId}&phase=${phase}`,
        true,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch Facebook data');
      }
      const rawData = await response.json();
      return rawData.map((post: any) => ({
        ...post,
        timestamp: new Date(post.timestamp),
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        facebookComments: post.facebookComments.map((comment: any) => ({
          ...comment,
          timestamp: new Date(comment.timestamp),
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.updatedAt),
        })),
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>
          Error loading Facebook data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No Facebook data available for this campaign phase.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Facebook Data</h1>
      {data.map((post) => (
        <FacebookPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

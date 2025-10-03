import { Card, CardContent } from '@/components/ui/card';
import type { FacebookComment } from '@/types/facebook';

interface FacebookCommentCardProps {
  comment: FacebookComment;
}

export function FacebookCommentCard({ comment }: FacebookCommentCardProps) {
  return (
    <Card className="ml-4 mt-2">
      <CardContent className="pt-4">
        <div className="flex items-start space-x-2">
          <div className="flex-1">
            <p className="font-semibold">{comment.authorName || 'Anonymous'}</p>
            <p className="text-sm text-gray-600">
              {comment.content || 'No content'}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span>{new Date(comment.timestamp).toLocaleString()}</span>
              <span>Likes: {comment.likes}</span>
              <span>Replies: {comment.replies}</span>
            </div>
            <a
              href={comment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-xs"
            >
              View Comment
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

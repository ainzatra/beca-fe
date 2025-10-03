import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { FacebookPost } from '@/types/facebook';
import { FacebookCommentCard } from './FacebookCommentCard';

interface FacebookPostCardProps {
  post: FacebookPost;
}

export function FacebookPostCard({ post }: FacebookPostCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">
              {new Date(post.timestamp).toLocaleString()}
            </p>
            <p className="mb-2">{post.content || 'No content'}</p>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm"
            >
              View Post
            </a>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex space-x-4">
            <Badge variant="secondary">Likes: {post.likes}</Badge>
            <Badge variant="secondary">Shares: {post.shares}</Badge>
            <Badge variant="secondary">Comments: {post.commentsCount}</Badge>
          </div>
          {post.facebookComments.length > 0 && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  {isOpen ? 'Hide Comments' : 'Show Comments'}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          )}
        </div>
      </CardHeader>
      {post.facebookComments.length > 0 && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent>
            <CardContent>
              <h4 className="font-semibold mb-2">Comments</h4>
              {post.facebookComments.map((comment) => (
                <FacebookCommentCard key={comment.id} comment={comment} />
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      )}
    </Card>
  );
}

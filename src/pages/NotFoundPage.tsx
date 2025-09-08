import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="flex items-center justify-center h-full">
      <Card className="max-w-xl w-full">
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl font-extrabold mb-4">404</div>
            <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
            <p className="text-sm text-muted-foreground mb-6">
              We couldn't find the page you're looking for. It may have been
              moved or removed.
            </p>

            {/* <div className="flex items-center justify-center gap-3">
              <Button onClick={() => navigate({ to: '/' })}>
                Go to dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/campaigns' })}
              >
                Browse campaigns
              </Button>
            </div> */}

            <div className="mt-6 text-xs text-muted-foreground">
              If you think this is an error, contact support.
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

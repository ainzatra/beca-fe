import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/utils';

type Props = {
  value: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  accentColor?: 'blue' | 'teal' | 'emerald' | 'red' | 'violet';
};

/**
 * StatCard - small reusable statistic card used on the dashboard
 * Uses bordered card design with colored left stripe
 */
export default function StatCard({
  value,
  title,
  subtitle,
  className = '',
  accentColor = 'blue',
}: Props) {
  const borderColors = {
    blue: 'border-l-primary',
    teal: 'border-l-secondary',
    emerald: 'border-l-emerald-500',
    red: 'border-l-red-500',
    violet: 'border-l-violet-500',
  };

  const textColors = {
    blue: 'text-primary',
    teal: 'text-secondary',
    emerald: 'text-emerald-600',
    red: 'text-red-600',
    violet: 'text-violet-600',
  };

  return (
    <Card
      className={cn(
        'rounded-lg overflow-hidden shadow-md border-l-4 bg-white',
        borderColors[accentColor],
        className,
      )}
    >
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div
            className={cn(
              'text-4xl font-bold drop-shadow-sm',
              textColors[accentColor],
            )}
          >
            {value}
          </div>
          {title && (
            <div
              className={cn(
                'text-sm mt-2 font-medium',
                textColors[accentColor],
              )}
            >
              {title}
            </div>
          )}
          {subtitle && (
            <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

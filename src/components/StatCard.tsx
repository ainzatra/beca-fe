import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Props = {
  value: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
};

/**
 * StatCard - small reusable statistic card used on the dashboard
 */
export default function StatCard({
  value,
  title,
  subtitle,
  className = '',
}: Props) {
  return (
    <Card className={cn('rounded-lg overflow-hidden shadow-md', className)}>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-4xl font-bold text-white drop-shadow-sm">
            {value}
          </div>
          {title && <div className="text-sm text-white/90 mt-2">{title}</div>}
          {subtitle && (
            <div className="text-xs text-white/80 mt-1">{subtitle}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

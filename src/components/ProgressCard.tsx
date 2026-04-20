import { CheckCircle } from 'lucide-react';

export function ProgressCard({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  return (
    <div className="rounded-md p-4 text-white bg-primary">
      <div className="font-semibold">{title}</div>
      <div className="text-3xl font-bold mt-2">{count}</div>
      <div className="text-sm mt-2 flex gap-2">
        <CheckCircle />
        Active
      </div>
    </div>
  );
}

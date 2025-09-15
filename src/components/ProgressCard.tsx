import { Check, CheckCircle } from 'lucide-react';

export function ProgressCard({
  title,
  count,
  from,
  to,
}: {
  title: string;
  count: number;
  from: string;
  to: string;
}) {
  return (
    <div
      className="rounded-md p-4 text-white"
      style={{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
    >
      <div className="font-semibold">{title}</div>
      <div className="text-3xl font-bold mt-2">{count}</div>
      <div className="text-sm mt-2 flex gap-2">
        <CheckCircle />
        Active
      </div>
    </div>
  );
}

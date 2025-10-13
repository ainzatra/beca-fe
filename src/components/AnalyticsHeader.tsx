import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export type Campaign = { id: string; title: string };
type AnalyticsHeaderProps = {
  campaigns: Campaign[];
  selectedCampaign: string;
  setSelectedCampaign: (id: string) => void;
  dateRange: string;
  setDateRange: (r: string) => void;
  onExport?: () => void;
};
export default function AnalyticsHeader({
  campaigns,
  selectedCampaign,
  setSelectedCampaign,
  dateRange,
  setDateRange,
  onExport,
}: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center items-start sm:justify-between gap-4">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="flex items-center gap-2">
        <Select
          value={selectedCampaign}
          onValueChange={(v) => setSelectedCampaign(v)}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="All Campaigns" />
          </SelectTrigger>
          <SelectContent>
            {campaigns.map((c) => (
              <SelectItem value={c.id} key={c.id}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* <Button variant="default" size="sm" onClick={onExport}>
          Export
        </Button> */}
      </div>
    </div>
  );
}

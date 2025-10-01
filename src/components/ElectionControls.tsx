import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { POSITIONS, YEARS, type ElectionControlsProps } from './ElectionShared';
import { Label } from './ui/label';

function ElectionControls({
  position,
  year,
  onPositionChange,
  onYearChange,
}: ElectionControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-start gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium ">Position</Label>
        <Select value={position} onValueChange={onPositionChange}>
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {POSITIONS.map((pos) => (
              <SelectItem key={pos.value} value={pos.value}>
                {pos.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium ">Year</Label>
        <Select value={year} onValueChange={onYearChange}>
          <SelectTrigger className="w-full sm:w-32 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default ElectionControls;

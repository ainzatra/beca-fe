import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { POSITIONS, YEARS, type ElectionControlsProps } from './ElectionShared';

function ElectionControls({
  position,
  year,
  onPositionChange,
  onYearChange,
}: ElectionControlsProps) {
  return (
    <div className="flex justify-start gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Position</label>
        <Select value={position} onValueChange={onPositionChange}>
          <SelectTrigger className="w-48 bg-white">
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
        <label className="text-sm font-medium text-white">Year</label>
        <Select value={year} onValueChange={onYearChange}>
          <SelectTrigger className="w-32 bg-white">
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

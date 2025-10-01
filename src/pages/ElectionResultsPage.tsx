import { useState } from 'react';
import ElectionControls from '@/components/ElectionControls';
import ElectionResultsDisplay from '@/components/ElectionResultsDisplay';

export default function ElectionResultsPage() {
  const [position, setPosition] = useState('mayor');
  const [year, setYear] = useState('2025');

  return (
    <div className="mx-auto space-y-6">
      <ElectionControls
        position={position}
        year={year}
        onPositionChange={setPosition}
        onYearChange={setYear}
      />

      <ElectionResultsDisplay position={position} year={year} />
    </div>
  );
}

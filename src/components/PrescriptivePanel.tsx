import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function PrescriptivePanel() {
  return (
    <div className="w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold">🔮 Prescriptive Analysis</h3>
          <p className="text-sm mt-1 text-white/90">
            Based on current trends, the candidate has a{' '}
            <strong>50% probability</strong> of winning.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-md px-4 py-3 text-center">
              <div className="text-xs font-semibold">📊 Pre-Campaign</div>
              <div className="text-sm mt-1">52%</div>
            </div>

            <div className="bg-white/10 rounded-md px-4 py-3 text-center">
              <div className="text-xs font-semibold">🎯 Mid-Campaign</div>
              <div className="text-sm mt-1">--</div>
            </div>

            <div className="bg-white/10 rounded-md px-4 py-3 text-center">
              <div className="text-xs font-semibold">📦 Post-Election</div>
              <div className="text-sm mt-1">--</div>
            </div>
          </div>

          <div className="mt-4 text-xs text-white/80">
            Last updated: {new Date().toLocaleString()}
          </div>
          <div className="mt-2 text-sm text-emerald-200">
            ● Real-time data active
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="default"
            className="bg-gradient-to-r from-indigo-700 to-emerald-500 text-white"
          >
            🔮 RUN PRESCRIPTIVE ANALYSIS
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white"
          >
            🔄 REFRESH DATA
          </Button>
          <Button variant="secondary" className="bg-emerald-500 text-white">
            ⚡ UPDATE REAL-TIME
          </Button>
        </div>
      </div>
    </div>
  );
}

import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { Campaign } from '@/components/CampaignCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';

type Props = {
  campaign: Campaign;
};

export default function CampaignManagementSheet({ campaign }: Props) {
  const [open, setOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<
    'Draft' | 'Active' | 'Paused' | 'Completed'
  >('Active');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  // Initialize local edits whenever campaign changes
  useEffect(() => {
    if (!campaign) return;
    setEditTitle(campaign.title);
    setEditDescription(campaign.description ?? '');
    setEditStatus(
      ((): 'Draft' | 'Active' | 'Paused' | 'Completed' => {
        const map: Record<string, 'Draft' | 'Active' | 'Paused' | 'Completed'> =
          {
            draft: 'Draft',
            active: 'Active',
            paused: 'Paused',
            completed: 'Completed',
          };
        // @ts-ignore - defensive
        return (
          map[(campaign.status ?? 'draft').toString().toLowerCase()] ?? 'Draft'
        );
      })(),
    );
    setCurrentPhaseIndex(
      Math.max(0, Math.min(2, (campaign.phasesCompleted ?? 0) - 1)),
    );
  }, [campaign]);

  const basePhases = useMemo(() => {
    const id = campaign?.id ?? 'temp';
    return [
      {
        id: `${id}-pre`,
        name: 'Pre-Campaign',
        description: 'Baseline awareness and sentiment before campaigning.',
        responses: campaign ? 52 : 0,
      },
      {
        id: `${id}-mid`,
        name: 'Mid-Campaign',
        description: 'Measure changes mid-campaign to inform tactics.',
        responses: 0,
      },
      {
        id: `${id}-post`,
        name: 'Post-Campaign',
        description: 'Final outcomes and voting intention after campaign.',
        responses: 0,
      },
    ];
  }, [campaign?.id]);

  const derivedPhases = basePhases.map((p, idx) => {
    const status =
      idx < currentPhaseIndex
        ? 'completed'
        : idx === currentPhaseIndex
          ? 'active'
          : 'pending';
    return { ...p, status, index: idx };
  });

  function currentPhaseMeetsRequirements() {
    const p = derivedPhases[currentPhaseIndex];
    return p.responses > 0;
  }

  function advancePhase() {
    if (currentPhaseIndex >= derivedPhases.length - 1) return;
    if (!currentPhaseMeetsRequirements()) return;

    // eslint-disable-next-line no-alert
    if (
      !window.confirm(
        'Advancing to the next phase is irreversible. Are you sure you want to continue?',
      )
    )
      return;

    const nextIndex = currentPhaseIndex + 1;
    setCurrentPhaseIndex(nextIndex);

    // Uncomment when have working backend to update the campaign current phase
    // if (campaign && onUpdate) {
    //   onUpdate({
    //     ...campaign,
    //     phasesCompleted: Math.max(campaign.phasesCompleted ?? 0, nextIndex + 1),
    //   });
    // }
  }

  function onSave() {
    if (!editTitle.trim()) {
      // eslint-disable-next-line no-alert
      alert('Title is required.');
      return;
    }

    const updated: Campaign = {
      ...campaign,
      title: editTitle.trim(),
      description: editDescription,
      // map editStatus to lowercase variant used by Campaign.status
      status: editStatus.toLowerCase() as Campaign['status'],
      phasesCompleted: Math.max(
        campaign?.phasesCompleted ?? 0,
        currentPhaseIndex + 1,
      ),
    };

    // Uncomment when have working backend to update the campaign details
    // onUpdate?.(updated);
    setOpen(false);
  }

  function onCancel() {
    if (!campaign) {
      setOpen(false);
      return;
    }
    setEditTitle(campaign.title);
    setEditDescription(campaign.description ?? '');
    setEditStatus(
      ((): 'Draft' | 'Active' | 'Paused' | 'Completed' => {
        const map: Record<string, 'Draft' | 'Active' | 'Paused' | 'Completed'> =
          {
            draft: 'Draft',
            active: 'Active',
            paused: 'Paused',
            completed: 'Completed',
          };
        // @ts-ignore
        return (
          map[(campaign.status ?? 'draft').toString().toLowerCase()] ?? 'Draft'
        );
      })(),
    );
    setCurrentPhaseIndex(
      Math.max(0, Math.min(2, (campaign.phasesCompleted ?? 0) - 1)),
    );
    setOpen(false);
  }

  return (
    <div className="flex items-start gap-2">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="default" size="sm" onClick={() => setOpen(true)}>
            Manage Campaign
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-full sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>Manage Campaign</SheetTitle>
          </SheetHeader>

          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <div className="mt-1">
                <Input
                  value={editTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditTitle(e.target.value)
                  }
                  placeholder="Campaign title"
                  aria-required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <div className="mt-1">
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-ring/50 focus-visible:border-ring"
                  rows={4}
                  placeholder="Brief description"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <div className="mt-1">
                <select
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(
                      e.target.value as
                        | 'Draft'
                        | 'Active'
                        | 'Paused'
                        | 'Completed',
                    )
                  }
                  className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-ring/50 focus-visible:border-ring w-full"
                >
                  <option>Draft</option>
                  <option>Active</option>
                  <option>Paused</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <section aria-labelledby="phases-heading" className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 id="phases-heading" className="text-sm font-semibold">
                  Phases
                </h3>
                <div className="text-sm text-muted-foreground">
                  {campaign?.phasesCompleted ?? 0} / {derivedPhases.length}{' '}
                  complete
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {derivedPhases.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-start gap-3 rounded-md border px-3 py-2 ${
                      p.status === 'completed'
                        ? 'bg-green-50 border-green-200'
                        : p.status === 'active'
                          ? 'bg-primary/5 border-primary/30'
                          : 'bg-transparent'
                    }`}
                  >
                    <div className="pt-1">
                      <div
                        className={`w-3 h-3 rounded-full ${p.status === 'completed' ? 'bg-green-600' : p.status === 'active' ? 'bg-primary' : 'bg-muted'}`}
                        aria-hidden
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.description}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          <div>{p.responses} responses</div>
                          <div className="mt-1 capitalize">{p.status}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Current phase:{' '}
                </div>
                <div className="font-medium">
                  {derivedPhases[currentPhaseIndex].name}
                </div>
                <div className="ml-auto text-sm">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={advancePhase}
                    disabled={
                      !currentPhaseMeetsRequirements() ||
                      currentPhaseIndex >= derivedPhases.length - 1
                    }
                  >
                    Advance to Next Phase
                  </Button>
                </div>
              </div>
              {!currentPhaseMeetsRequirements() && (
                <div className="text-xs text-destructive mt-1">
                  Current phase requirements not met — cannot advance.
                </div>
              )}
            </section>
          </div>

          <SheetFooter>
            <div className="flex items-center gap-2 w-full">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Button onClick={onSave} disabled={!editTitle.trim()}>
                  Save Changes
                </Button>
              </div>
            </div>
            <SheetClose />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

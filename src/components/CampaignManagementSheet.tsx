import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { CampaignDetails } from '@/pages/CampaignDetailPage';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { api, checkPhasesCompleted } from '@/utils/utils';
import type { CampaignStatus } from './CampaignCard';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  campaign: CampaignDetails;
};

export default function CampaignManagementSheet({ campaign }: Props) {
  const [open, setOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<CampaignStatus>('ACTIVE');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [confirmAdvanceOpen, setConfirmAdvanceOpen] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  // Initialize local edits whenever campaign changes
  useEffect(() => {
    if (!campaign) return;
    const phaseCompleted = checkPhasesCompleted(
      campaign.activePhase,
      campaign.status,
    );
    setEditTitle(campaign.title);
    setEditDescription(campaign.description ?? '');
    setEditStatus(campaign.status);
    setCurrentPhaseIndex(phaseCompleted);
  }, [campaign]);

  const phases = useMemo(() => ['PRE', 'MID', 'POST'] as const, []);

  const basePhases = useMemo(() => {
    const id = campaign?.id ?? 'temp';
    return phases.map((ph) => {
      const responses = (campaign?.totalsByPhase as any)?.[ph]?.responses ?? 0;
      return {
        id: `${id}-${ph.toLowerCase()}`,
        name: `${ph}-CAMPAIGN`,
        responses,
        phase: ph,
      };
    });
  }, [campaign?.id, campaign?.totalsByPhase, phases]);

  const derivedPhases = basePhases.map((p, idx) => {
    const status = idx === currentPhaseIndex ? 'active' : 'inactive';
    return { ...p, status, index: idx };
  });

  function currentPhaseMeetsRequirements() {
    const p = derivedPhases[currentPhaseIndex];
    return p.responses > 0;
  }

  function advancePhase() {
    if (currentPhaseIndex >= derivedPhases.length - 1) return;
    if (!currentPhaseMeetsRequirements()) return;

    const nextIndex = currentPhaseIndex + 1;
    setCurrentPhaseIndex(nextIndex);
    setConfirmAdvanceOpen(false);
  }

  function completeCampaign() {
    setEditStatus('COMPLETED');
    setConfirmCompleteOpen(false);
  }

  async function onSave() {
    if (!editTitle.trim()) {
      toast.error('Title is required.', {
        style: { backgroundColor: 'red', color: 'white' },
        duration: 2000,
      });
      return;
    }

    const activePhase = phases[currentPhaseIndex];

    const payload = {
      title: editTitle,
      description: editDescription,
      status: editStatus,
      activePhase,
    };

    try {
      setIsSaving(true);
      const response = await api(`/campaign/${campaign.id}`, true, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        toast.error('Failed to update. Please try again later.', {
          style: { backgroundColor: 'red', color: 'white' },
          duration: 1000,
        });
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['campaign', campaign.id] });
      toast.success('Campaign updated successfully', {
        style: { backgroundColor: 'limegreen', color: 'white' },
        duration: 1000,
      });
      setOpen(false);
      setConfirmSaveOpen(false);
      setConfirmCompleteOpen(false);
    } finally {
      setIsSaving(false);
    }
  }

  function onCancel() {
    if (isSaving) return;
    if (!campaign) {
      setOpen(false);
      return;
    }
    setEditTitle(campaign.title);
    setEditDescription(campaign.description ?? '');
    setEditStatus(campaign.status);
    setCurrentPhaseIndex(
      checkPhasesCompleted(campaign.activePhase, campaign.status),
    );
    setConfirmCompleteOpen(false);
    setOpen(false);
  }

  return (
    <div className="flex items-start gap-2">
      <Sheet
        open={open}
        onOpenChange={(newOpen) => {
          if (newOpen || !isSaving) setOpen(newOpen);
        }}
      >
        <SheetTrigger asChild>
          <Button variant="default" size="sm" onClick={() => setOpen(true)}>
            Manage Campaign
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-full sm:max-w-md flex flex-col h-full max-h-[100vh]"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>Manage Campaign</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-2">
            <div>
              <label className="text-sm font-medium">Title</label>
              <div className="mt-1">
                <Input
                  value={editTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditTitle(e.target.value)
                  }
                  placeholder="Campaign title"
                  disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <div className="mt-1">
                <select
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(e.target.value as CampaignStatus)
                  }
                  className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-ring/50 focus-visible:border-ring w-full"
                  disabled={isSaving}
                >
                  <option value={'DRAFT'}>Draft</option>
                  <option value={'ACTIVE'}>Active</option>
                </select>
              </div>
            </div>

            <section aria-labelledby="phases-heading" className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 id="phases-heading" className="text-sm font-semibold">
                  Phases
                </h3>
                <div className="text-sm text-muted-foreground">
                  {checkPhasesCompleted(campaign.activePhase, campaign.status)}{' '}
                  / {derivedPhases.length} complete
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {derivedPhases.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 rounded-md border px-3 py-2 ${
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
                  {phases[currentPhaseIndex] === 'POST' ? (
                    <AlertDialog
                      open={confirmCompleteOpen}
                      onOpenChange={setConfirmCompleteOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          disabled={
                            !currentPhaseMeetsRequirements() ||
                            isSaving ||
                            editStatus === 'COMPLETED'
                          }
                        >
                          Complete Campaign
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Confirm Campaign Completion
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Completing the campaign will mark it as finished but
                            keep the POST phase active for AI analysis. This
                            action is irreversible. Are you sure you want to
                            continue?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={completeCampaign}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <AlertDialog
                      open={confirmAdvanceOpen}
                      onOpenChange={setConfirmAdvanceOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          disabled={
                            !currentPhaseMeetsRequirements() ||
                            currentPhaseIndex >= derivedPhases.length - 1 ||
                            isSaving
                          }
                        >
                          Advance to Next Phase
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Confirm Phase Advancement
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Advancing to the next phase is irreversible. Are you
                            sure you want to continue?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={advancePhase}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
              {!currentPhaseMeetsRequirements() && (
                <div className="text-xs text-destructive mt-1">
                  {phases[currentPhaseIndex] === 'POST'
                    ? 'POST phase must have at least 1 response to complete the campaign.'
                    : 'Current phase requirements not met — cannot advance.'}
                </div>
              )}
            </section>
          </div>

          <SheetFooter className="mt-auto p-4 pt-0">
            <div className="flex items-center gap-2 w-full">
              <Button variant="outline" onClick={onCancel} disabled={isSaving}>
                Cancel
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <AlertDialog
                  open={confirmSaveOpen}
                  onOpenChange={setConfirmSaveOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button disabled={!editTitle.trim() || isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Save Changes</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to save these changes to the
                        campaign?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onSave}>
                        {isSaving ? 'Saving...' : 'Confirm'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <SheetClose />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

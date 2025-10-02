import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utils/utils';
import type { Campaign, CampaignStatus } from '@/components/CampaignCard';
import { useUserStore } from '@/stores/useUserStore';
import { useState } from 'react';

export interface CreateCampaign {
  title: string;
  description?: string;
  status: CampaignStatus;
  candidateName?: string;
  candidatePosition?: string;
  candidateParty?: string;
  fbUrl?: string;
}

export default function CreateCampaignModal({
  onCreate,
}: {
  onCreate: (payload: CreateCampaign) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Campaign['status']>('DRAFT');
  const [candidateName, setCandidateName] = useState('');
  const [candidatePosition, setCandidatePosition] = useState('');
  const [candidateParty, setCandidateParty] = useState('');
  const [fbUrl, setFbUrl] = useState('');

  const { user } = useUserStore();
  const isSurveyor = user?.role === 'SURVEYOR';

  const submit = () => {
    const campaign: CreateCampaign = {
      title: title,
      description,
      status,
      candidateName,
      candidatePosition,
      candidateParty,
      fbUrl,
    };
    onCreate(campaign);
    setOpen(false);
    setTitle('');
    setDescription('');
    setStatus('DRAFT');
    setCandidateName('');
    setCandidatePosition('');
    setCandidateParty('');
    setFbUrl('');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className="whitespace-nowrap"
          disabled={isSurveyor}
        >
          Create New Campaign
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Create Campaign</SheetTitle>
          <SheetDescription>
            Provide basic information about the campaign. You can edit details
            later.
          </SheetDescription>
        </SheetHeader>

        <div className="p-4 flex flex-col gap-3">
          <label className="text-sm text-muted-foreground">
            Campaign Title
          </label>
          <Input
            placeholder="e.g. 2026 Mayoral Run"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="text-sm text-muted-foreground mt-2">
            Description
          </label>
          <textarea
            className={cn(
              'min-h-[80px] resize-none rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50',
            )}
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="text-sm text-muted-foreground mt-2">Status</label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as Campaign['status'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>

          <label className="text-sm text-muted-foreground mt-2">
            Candidate Name
          </label>
          <Input
            placeholder="e.g. John Doe"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />

          <label className="text-sm text-muted-foreground mt-2">
            Candidate Position
          </label>
          <Input
            placeholder="e.g. Mayor"
            value={candidatePosition}
            onChange={(e) => setCandidatePosition(e.target.value)}
          />

          <label className="text-sm text-muted-foreground mt-2">
            Candidate Party
          </label>
          <Input
            placeholder="e.g. Democratic Party"
            value={candidateParty}
            onChange={(e) => setCandidateParty(e.target.value)}
          />

          <label className="text-sm text-muted-foreground mt-2">
            Facebook URL
          </label>
          <Input
            placeholder="e.g. https://facebook.com/johndoe"
            value={fbUrl}
            onChange={(e) => setFbUrl(e.target.value)}
          />
        </div>

        <SheetFooter>
          <div className="flex items-center gap-2 w-full">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <div className="ml-auto">
              <Button onClick={submit}>Create</Button>
            </div>
          </div>
          <SheetClose />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

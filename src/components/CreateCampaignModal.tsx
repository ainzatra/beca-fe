import * as React from 'react';
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

export interface CreateCampaign {
  title: string;
  description?: string;
  status: CampaignStatus;
}

export default function CreateCampaignModal({
  onCreate,
}: {
  onCreate: (payload: CreateCampaign) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [status, setStatus] = React.useState<Campaign['status']>('DRAFT');

  const submit = () => {
    const campaign: CreateCampaign = {
      title: title,
      description,
      status,
    };
    onCreate(campaign);
    setOpen(false);
    setTitle('');
    setDescription('');
    setStatus('DRAFT');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" className="whitespace-nowrap">
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

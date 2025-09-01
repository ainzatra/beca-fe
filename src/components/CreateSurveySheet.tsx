import * as React from 'react';
import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/utils';
import { toast } from 'sonner';
import type { CampaignPhase } from '@/components/CampaignCard';
import { Plus } from 'lucide-react';

interface CreateSurveySheetProps {
  campaignId?: string;
  phase?: CampaignPhase;
  onCreated?: (survey: CreatedSurvey) => void;
}

interface CreatedSurvey {
  id: string;
  title: string;
  form: string;
  createdAt: string;
  phase: CampaignPhase;
}

export default function CreateSurveySheet({
  campaignId,
  phase,
  onCreated,
}: CreateSurveySheetProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: { title: string }) => {
      const body: Record<string, any> = {
        title: payload.title,
        form: JSON.stringify([]),
      };
      if (typeof phase !== 'undefined') body.phase = phase;
      if (typeof campaignId !== 'undefined') body.campaignId = campaignId;

      console.log({ body });
      const res = await api('/survey', true, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to create survey');
      }

      return res.json();
    },
    onSuccess: (created: CreatedSurvey) => {
      toast.success('Survey created successfully.', {
        style: {
          backgroundColor: 'limegreen',
          color: 'white',
        },
      });

      setOpen(false);
      setTitle('');
      queryClient.invalidateQueries({
        queryKey: ['surveys', phase, campaignId],
      });

      if (onCreated) onCreated(created);
    },
    onError: (err: any) => {
      toast.error(err?.message ?? 'Failed to create survey');
    },
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="whitespace-nowrap w-full">
          <Plus />
          Add Survey
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Create Survey</SheetTitle>
          <SheetDescription>Enter a title for the new survey.</SheetDescription>
        </SheetHeader>

        <div className="p-4">
          <Label className="mb-2">Survey Title</Label>
          <Input
            placeholder="e.g. Pre-campaign Survey"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <SheetFooter>
          <div className="flex items-center gap-2 w-full">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <div className="ml-auto">
              <Button
                onClick={() => {
                  if (!title.trim()) {
                    toast.error('Please provide a survey title');
                    return;
                  }
                  mutation.mutate({ title: title.trim() });
                }}
              >
                Create
              </Button>
            </div>
          </div>
          <SheetClose />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

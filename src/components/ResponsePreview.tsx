import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';

type ResponsePreviewProps = {
  response: Record<string, any> | null;
  open: boolean;
  onClose: () => void;
};

function tryParseData(data: any) {
  if (!data) return null;
  if (typeof data === 'object') return data;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      // Not JSON — return raw string
      return data;
    }
  }
  return data;
}

export default function ResponsePreview({
  response,
  open,
  onClose,
}: ResponsePreviewProps) {
  const parsed = tryParseData(response?.data ?? response?.answers ?? null);

  const defaultInfoFields = [
    'id',
    'name',
    'address',
    'phone',
    'createdAt',
    'valid_id',
  ];
  const otherKeys = response
    ? Object.keys(response).filter((k) => !defaultInfoFields.includes(k))
    : [];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[600px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>
            {response?.name
              ? `Response — ${response.name}`
              : response?.id
                ? `Response — ${String(response.id).slice(0, 8)}`
                : 'Response'}
          </SheetTitle>
          <SheetDescription>
            Preview of the respondent's submitted answers and metadata
          </SheetDescription>
        </SheetHeader>

        <Card className="m-4">
          <CardHeader>
            <CardTitle>Respondent Info</CardTitle>
            <CardDescription className="truncate">
              Submitted{' '}
              {response?.createdAt
                ? new Date(response.createdAt).toLocaleString()
                : '—'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <div className="text-sm">
                <span className="font-medium">Name: </span>
                {response?.name ?? '—'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Address: </span>
                {response?.address ?? '—'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Phone: </span>
                {response?.phone ?? '—'}
              </div>
              {response?.valid_id && (
                <div className="text-sm">
                  <span className="font-medium">Valid ID: </span>
                  <span className="italic">{response.valid_id}</span>
                </div>
              )}
            </div>

            <div className="">
              <div className="mb-2 text-sm font-medium">Answers</div>

              {/* Render parsed data intelligently */}
              {parsed == null ? (
                <div className="text-xs text-muted-foreground">
                  No answers found
                </div>
              ) : Array.isArray(parsed) ? (
                parsed.length === 0 ? (
                  <div className="text-xs text-muted-foreground">
                    No answers
                  </div>
                ) : (
                  parsed.map((it, idx) => (
                    <div key={idx} className="p-3 border rounded-md mb-2">
                      {typeof it === 'object' ? (
                        <>
                          <div className="font-medium">
                            {it.questionTitle ?? it.title ?? `Q${idx + 1}`}
                            {it.required ? (
                              <Badge className="ml-2">Required</Badge>
                            ) : null}
                          </div>
                          <div className="text-sm mt-1">
                            {Array.isArray(it.value)
                              ? it.value.join(', ')
                              : it.value}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm">{String(it)}</div>
                      )}
                    </div>
                  ))
                )
              ) : typeof parsed === 'object' ? (
                Object.keys(parsed).length === 0 ? (
                  <div className="text-xs text-muted-foreground">
                    No answers
                  </div>
                ) : (
                  Object.entries(parsed).map(([k, v]) => (
                    <div key={k} className="p-3 border rounded-md mb-2">
                      <div className="font-medium">{k}</div>
                      <div className="text-sm mt-1">
                        {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                      </div>
                    </div>
                  ))
                )
              ) : (
                <div className="p-3 border rounded-md">
                  <div className="text-sm">{String(parsed)}</div>
                </div>
              )}
            </div>

            {/* Any other top-level keys on the response (excluding default info) */}
            {/* {otherKeys.length > 0 && (
              <div>
                <div className="mb-2 text-sm font-medium">Other metadata</div>
                <div className="space-y-2">
                  {otherKeys.map((k) => (
                    <div key={k} className="p-2 border rounded-md">
                      <div className="text-xs text-muted-foreground">{k}</div>
                      <div className="text-sm">
                        {typeof response![k] === 'object'
                          ? JSON.stringify(response![k])
                          : String(response![k])}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </CardContent>
        </Card>

        <SheetFooter>
          <div className="flex justify-end">
            <Button variant="destructive" onClick={onClose}>
              Close
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

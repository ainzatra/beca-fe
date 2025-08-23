import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DefaultInfoSection({
  values,
  onChange,
}: {
  values: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Respondent Information</CardTitle>
        <CardDescription>
          Default fields collected for every respondent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>Name</Label>
            <Input
              placeholder="Full name"
              value={values.name || ''}
              onChange={(e) => onChange({ ...values, name: e.target.value })}
            />
          </div>

          <div>
            <Label>Contact Number</Label>
            <Input
              placeholder="Mobile or landline"
              value={values.contact || ''}
              onChange={(e) => onChange({ ...values, contact: e.target.value })}
            />
          </div>

          <div>
            <Label>Address</Label>
            <Input
              placeholder="Barangay, City, Province"
              value={values.address || ''}
              onChange={(e) => onChange({ ...values, address: e.target.value })}
            />
          </div>

          <div>
            <Label>Additional ID (optional)</Label>
            <Input
              placeholder="Voter ID or other"
              value={values.idNumber || ''}
              onChange={(e) =>
                onChange({ ...values, idNumber: e.target.value })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
            <Select
              value={values.address || ''}
              onValueChange={(value) => onChange({ ...values, address: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select address" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BONGA MAYOR">BONGA MAYOR</SelectItem>
                <SelectItem value="BONGA MENOR">BONGA MENOR</SelectItem>
                <SelectItem value="BUISAN">BUISAN</SelectItem>
                <SelectItem value="CAMACHILIHAN">CAMACHILIHAN</SelectItem>
                <SelectItem value="CAMBAOG">CAMBAOG</SelectItem>
                <SelectItem value="CATACTE">CATACTE</SelectItem>
                <SelectItem value="LICIADA">LICIADA</SelectItem>
                <SelectItem value="MALAMIG">MALAMIG</SelectItem>
                <SelectItem value="MALAWAK">MALAWAK</SelectItem>
                <SelectItem value="POBLACION">POBLACION</SelectItem>
                <SelectItem value="SAN PEDRO">SAN PEDRO</SelectItem>
                <SelectItem value="TALAMPAS">TALAMPAS</SelectItem>
                <SelectItem value="TANAWAN">TANAWAN</SelectItem>
                <SelectItem value="TIBAGAN">TIBAGAN</SelectItem>
              </SelectContent>
            </Select>
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

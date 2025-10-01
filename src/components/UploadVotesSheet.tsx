import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { POSITIONS, YEARS } from './ElectionShared';
import { Plus } from 'lucide-react';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface UploadVotesSheetProps {
  onUploadSuccess?: () => void;
}

export default function UploadVotesSheet({
  onUploadSuccess,
}: UploadVotesSheetProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState('');
  const [year, setYear] = useState('');
  const [voteFile, setVoteFile] = useState<File | null>(null);
  const [precinctFile, setPrecinctFile] = useState<File | null>(null);
  const qc = useQueryClient();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position || !year || !voteFile || !precinctFile) {
      alert('Please fill all fields and select files.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('year', year);
    formData.append('position', position);
    formData.append('voteFiles', voteFile);
    formData.append('precinctFile', precinctFile);
    console.log('Submitting form data:', {
      year,
      position,
      voteFile,
      precinctFile,
    });
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('beca_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${baseUrl}/llm/count-votes`, {
        method: 'POST',
        headers,
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        // alert('Votes uploaded successfully!');
        toast.success('Votes uploaded successfully!');
        setOpen(false);
        onUploadSuccess?.();
        // Reset form
        setPosition('');
        setYear('');
        setVoteFile(null);
        setPrecinctFile(null);
        qc.invalidateQueries({ queryKey: ['election-results'] });
      } else {
        // alert('Failed to upload votes.');
        toast.error(result.message || 'Failed to upload votes.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Votes
        </Button>
      </SheetTrigger>
      <SheetContent className="p-4">
        <SheetHeader>
          <SheetTitle>Upload Votes</SheetTitle>
          <SheetDescription>
            Upload vote and precinct PDF files along with election details.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label className="text-sm font-medium">Position</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map((pos) => (
                  <SelectItem key={pos.value} value={pos.value}>
                    {pos.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Vote File</Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => setVoteFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Precinct File</Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => setPrecinctFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

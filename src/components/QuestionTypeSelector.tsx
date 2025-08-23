import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';

type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox';

export default function QuestionTypeSelector({
  value,
  onChange,
}: {
  value: QuestionType;
  onChange: (q: QuestionType) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as QuestionType)}>
      <SelectTrigger className="w-48 cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Question Type</SelectLabel>
          <SelectItem value="text">Text (single line)</SelectItem>
          <SelectItem value="textarea">Textarea (multi-line)</SelectItem>
          <SelectItem value="radio">Single choice (radio)</SelectItem>
          <SelectItem value="checkbox">Multi choice (checkbox)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

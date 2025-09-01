import React from 'react';
import type { Question } from '@/utils/surveyUtils';

type Props = {
  q: Question;
  value: any;
  onChange: (v: any) => void;
};

export default function PublicQuestionBlock({ q, value, onChange }: Props) {
  return (
    <div className="p-4 border rounded-md bg-background">
      <div className="flex items-center justify-between">
        <div className="font-medium">{q.title}</div>
        {q.required && <div className="text-xs text-red-600">Required</div>}
      </div>

      <div className="mt-2">
        {q.type === 'text' && (
          <input
            className="w-full border rounded p-2"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {q.type === 'textarea' && (
          <textarea
            className="w-full border rounded p-2 min-h-[96px]"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {q.type === 'radio' && (
          <div className="flex flex-col gap-2 mt-2">
            {q.options.length === 0 ? (
              <div className="text-xs text-muted-foreground">No options</div>
            ) : (
              q.options.map((opt, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={q.id}
                    checked={value === opt}
                    onChange={() => onChange(opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))
            )}
          </div>
        )}

        {q.type === 'checkbox' && (
          <div className="flex flex-col gap-2 mt-2">
            {q.options.length === 0 ? (
              <div className="text-xs text-muted-foreground">No options</div>
            ) : (
              q.options.map((opt, i) => {
                const checked = Array.isArray(value) && value.includes(opt);
                return (
                  <label key={i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = new Set(value ?? []);
                        if (e.target.checked) next.add(opt);
                        else next.delete(opt);
                        onChange(Array.from(next));
                      }}
                    />
                    <span>{opt}</span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

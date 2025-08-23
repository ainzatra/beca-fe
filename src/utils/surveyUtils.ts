/**
 * Shared types and helpers for survey components
 */

export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox';

export type Question = {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  options: string[];
};

export const uid = (prefix = '') =>
  `${prefix}${Math.random().toString(36).slice(2, 9)}`;

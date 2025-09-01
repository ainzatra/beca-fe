/**
 * Shared types and helpers for survey components
 */
import cuid from 'cuid';

export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox';

export type Question = {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  options: string[];
};

export const uid = (prefix = '') => `${prefix}${cuid()}`;

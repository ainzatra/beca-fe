import type { CampaignPhase, CampaignStatus } from '@/components/CampaignCard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function api(
  path: string,
  useToken: boolean = false,
  options: RequestInit = {},
) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  console.log('API Base URL:', baseUrl);

  // Force headers into a plain object
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add token if requested
  if (useToken) {
    const token = localStorage.getItem('beca_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  return response;
}

export function checkPhasesCompleted(
  activePhase: CampaignPhase,
  status?: CampaignStatus,
) {
  let count = 0;
  if (activePhase === 'PRE') count = 0;
  if (activePhase === 'MID') count = 1;
  if (activePhase === 'POST') count = 2;
  if (status === 'COMPLETED') count = 3;

  return count;
}

import CampaignsPage from '@/pages/CampaignsPage';
import Header from '@/components/Header';
import { createFileRoute } from '@tanstack/react-router';
import type { Campaign } from '@/components/CampaignCard';

export const Route = createFileRoute('/campaigns/')({
  component: RouteComponent,
});

function RouteComponent() {
  // use tanstack query isntead after creating backend
  const initialCampaigns: Campaign[] = [
    {
      id: 'c_1iouu871',
      title: '2025 Presidential Campaign',
      status: 'active', // assuming CampaignStatus is a union like "active" | "completed" | "draft"
      createdAt: '2025-08-01T10:00:00Z',
      phasesCompleted: 1,
      description: 'National level campaign for the 2025 elections.',
    },
    {
      id: 'c_1iouu872',
      title: 'Youth Awareness Drive',
      status: 'draft',
      createdAt: '2025-08-05T15:30:00Z',
      phasesCompleted: 0,
      description: 'Focused on engaging first-time voters.',
    },
    {
      id: 'c_1iouu873',
      title: 'Local Community Outreach',
      status: 'completed',
      createdAt: '2025-07-20T08:00:00Z',
      phasesCompleted: 3,
      description: 'Completed outreach campaign for rural communities.',
    },
    {
      id: 'c_1iouu874',
      title: 'Digital Media Blitz',
      status: 'active',
      createdAt: '2025-08-15T12:00:00Z',
      phasesCompleted: 2,
      description: 'Ongoing digital advertising across social platforms.',
    },
  ];
  return (
    <div>
      <Header />
      <CampaignsPage initial={initialCampaigns} />
    </div>
  );
}

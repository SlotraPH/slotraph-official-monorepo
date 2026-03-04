import type { BookingStaffMember, TeamMemberRecord } from '@/domain/staff/types';

export const OWNER_TEAM_MEMBERS: TeamMemberRecord[] = [
  {
    id: 'tm-1',
    name: 'Dheyn Ramos',
    role: 'Owner / Lead Barber',
    bio: 'Leads premium grooming services and complex color consultations.',
    badge: 'Owner',
    services: ['Haircut & Style', 'Color & Highlights'],
    schedule: 'Tue-Sun, 10 AM to 7 PM',
    status: 'Active',
  },
  {
    id: 'tm-2',
    name: 'Kai Flores',
    role: 'Junior Barber',
    bio: 'Supports high-volume haircut and beard trim bookings.',
    badge: 'High volume',
    services: ['Haircut & Style', 'Beard Trim'],
    schedule: 'Wed-Sun, 11 AM to 8 PM',
    status: 'Active',
  },
  {
    id: 'tm-3',
    name: 'Sam Bautista',
    role: 'Front desk',
    bio: 'Handles customer support, check-ins, and manual payment confirmations.',
    badge: 'Support',
    services: ['Customer support'],
    schedule: 'Mon-Sat, 9 AM to 6 PM',
    status: 'Invite pending',
  },
];

export const PUBLIC_BOOKING_STAFF: BookingStaffMember[] = [
  {
    id: 'staff-ana',
    name: 'Ana Reyes',
    role: 'Senior Stylist',
    bio: 'Precision cuts and modern shape work for short to medium hair.',
    badge: 'Most requested',
    services: ['Signature Cut + Finish'],
    schedule: 'Tue-Sat, 10 AM to 7 PM',
    status: 'Active',
  },
  {
    id: 'staff-mika',
    name: 'Mika Santos',
    role: 'Color Specialist',
    bio: 'Lived-in color, gloss refresh, and tone correction for returning clients.',
    badge: 'Color specialist',
    services: ['Signature Cut + Finish', 'Gloss + Root Refresh'],
    schedule: 'Wed-Sun, 11 AM to 8 PM',
    status: 'Active',
  },
  {
    id: 'staff-jo',
    name: 'Jo Navarro',
    role: 'Treatment Therapist',
    bio: 'Focuses on scalp resets, smoothing rituals, and recovery sessions.',
    badge: 'Treatment focus',
    services: ['Scalp Reset Treatment'],
    schedule: 'Thu-Sun, 10 AM to 6 PM',
    status: 'Active',
  },
];

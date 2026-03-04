import type { BookingBusinessProfile, BookingService, BookingStaffMember } from './types';

export const bookingBusiness: BookingBusinessProfile = {
  id: 'business-serene-studio',
  name: 'Serene Studio Makati',
  category: 'Beauty Studio',
  city: 'Makati City',
  description: 'A calm appointment-based studio for cuts, color maintenance, and restorative treatments.',
  responseTime: 'Replies within 15 minutes during studio hours',
  rating: 4.9,
  reviewCount: 187,
  bookingSlug: 'serene-studio-makati',
};

export const bookingStaff: BookingStaffMember[] = [
  {
    id: 'staff-ana',
    name: 'Ana Reyes',
    role: 'Senior Stylist',
    bio: 'Precision cuts and modern shape work for short to medium hair.',
    badge: 'Most requested',
  },
  {
    id: 'staff-mika',
    name: 'Mika Santos',
    role: 'Color Specialist',
    bio: 'Lived-in color, gloss refresh, and tone correction for returning clients.',
    badge: 'Color specialist',
  },
  {
    id: 'staff-jo',
    name: 'Jo Navarro',
    role: 'Treatment Therapist',
    bio: 'Focuses on scalp resets, smoothing rituals, and recovery sessions.',
    badge: 'Treatment focus',
  },
];

export const bookingServices: BookingService[] = [
  {
    id: 'svc-signature-cut',
    name: 'Signature Cut + Finish',
    description: 'Consultation, wash, cut, and styled finish for a polished reset.',
    durationMinutes: 75,
    price: 1400,
    category: 'Haircut',
    staffSelectionMode: 'required',
    staffIds: ['staff-ana', 'staff-mika'],
    leadNote: 'Best for shape refreshes, layers, and first-time visits.',
  },
  {
    id: 'svc-color-refresh',
    name: 'Gloss + Root Refresh',
    description: 'Color maintenance session designed for regrowth and shine recovery.',
    durationMinutes: 120,
    price: 2800,
    category: 'Color',
    staffSelectionMode: 'required',
    staffIds: ['staff-mika'],
    leadNote: 'Existing color clients usually book this every 6 to 8 weeks.',
  },
  {
    id: 'svc-scalp-reset',
    name: 'Scalp Reset Treatment',
    description: 'Express restorative treatment with scalp massage and hydration finish.',
    durationMinutes: 45,
    price: 900,
    category: 'Treatment',
    staffSelectionMode: 'none',
    staffIds: [],
    leadNote: 'No staff selection needed. The front desk assigns the next available therapist.',
  },
];

export const bookingServicesById = Object.fromEntries(
  bookingServices.map((service) => [service.id, service]),
);

export const bookingStaffById = Object.fromEntries(
  bookingStaff.map((member) => [member.id, member]),
);

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) {
    return `${minutes} min`;
  }

  if (!remainingMinutes) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

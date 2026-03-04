export const BRAND_INDUSTRIES = [
  'Beauty & Wellness',
  'Health & Fitness',
  'Hair & Barbering',
  'Nail & Spa',
  'Medical & Dental',
  'Tutoring & Education',
  'Legal & Consulting',
  'Photography',
  'Cleaning Services',
  'Pet Care',
  'Auto Services',
  'Events & Entertainment',
  'Other',
] as const;

export const MAX_BRAND_ABOUT_LENGTH = 280;

export function sanitizeBookingSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getBusinessInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

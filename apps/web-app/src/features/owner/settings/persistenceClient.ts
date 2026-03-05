import { getOwnerBusinessSettingsResource, getOwnerPaymentsResource } from '@/features/owner/data';

export interface BrandSettingsDraft {
  name: string;
  slug: string;
  industry: string;
  about: string;
}

export interface TeamInviteDraft {
  name: string;
  role: string;
  email: string;
}

export interface TeamSecurityDraft {
  sessionTimeout: string;
  require2fa: boolean;
}

export interface TeamSettingsDraft {
  invite: TeamInviteDraft;
  security: TeamSecurityDraft;
}

export interface NotificationTriggerDraft {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface NotificationsSettingsDraft {
  triggers: NotificationTriggerDraft[];
  channel: string;
  subject: string;
  message: string;
}

export interface DomainSettingsDraft {
  subdomain: string;
  activeIssueId: string | null;
}

export interface BookingBuilderSectionDraft {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface BookingIntakeFieldDraft {
  id: string;
  label: string;
  placeholder: string;
  enabled: boolean;
  required: boolean;
}

export interface BookingSettingsDraft {
  leadTime: string;
  cancellationWindow: string;
  bookingApproval: string;
  heroHeadline: string;
  heroSubcopy: string;
  sections: BookingBuilderSectionDraft[];
  intakeFields: BookingIntakeFieldDraft[];
}

export interface PublishSettingsDraft {
  published: boolean;
}

export interface BusinessSettingsDraft {
  phone: string;
  email: string;
  address: string;
  timezone: string;
  arrivalNotes: string;
}

export interface OwnerSettingsPersistenceSnapshot {
  brand: BrandSettingsDraft;
  business: BusinessSettingsDraft;
  team: TeamSettingsDraft;
  notifications: NotificationsSettingsDraft;
  domain: DomainSettingsDraft;
  booking: BookingSettingsDraft;
  publish: PublishSettingsDraft;
}

export interface OwnerSettingsPersistenceClient {
  loadSnapshot(): Promise<OwnerSettingsPersistenceSnapshot>;
  saveBrand(draft: BrandSettingsDraft): Promise<BrandSettingsDraft>;
  saveBusiness(draft: BusinessSettingsDraft): Promise<BusinessSettingsDraft>;
  saveTeam(draft: TeamSettingsDraft): Promise<TeamSettingsDraft>;
  saveNotifications(draft: NotificationsSettingsDraft): Promise<NotificationsSettingsDraft>;
  saveDomain(draft: DomainSettingsDraft): Promise<DomainSettingsDraft>;
  saveBooking(draft: BookingSettingsDraft): Promise<BookingSettingsDraft>;
  savePublish(draft: PublishSettingsDraft): Promise<PublishSettingsDraft>;
}

const SETTINGS_STORAGE_KEY = 'slotra.owner.settings.v2';

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createDefaultSnapshot(): OwnerSettingsPersistenceSnapshot {
  const businessResource = getOwnerBusinessSettingsResource();
  const paymentsResource = getOwnerPaymentsResource();

  const business = businessResource.status === 'ready' ? businessResource.data.business : null;
  const payments = paymentsResource.status === 'ready' ? paymentsResource.data.bookingPreferences : null;

  return {
    brand: {
      name: business?.name ?? '',
      slug: business?.bookingSlug ?? '',
      industry: business?.industry ?? '',
      about: business?.description ?? '',
    },
    business: {
      phone: business?.phone ?? '',
      email: business?.email ?? '',
      address: business?.address ?? '',
      timezone: business?.timezone ?? 'Asia/Manila',
      arrivalNotes: business?.arrivalNotes ?? '',
    },
    team: {
      invite: {
        name: '',
        role: 'Owner assistant',
        email: '',
      },
      security: {
        sessionTimeout: '30 minutes',
        require2fa: true,
      },
    },
    notifications: {
      triggers: [
        {
          id: 'confirmations',
          label: 'Booking confirmations',
          description: 'Send confirmation immediately after approval.',
          enabled: true,
        },
        {
          id: 'reminders',
          label: 'Reminder sequence',
          description: 'Send reminders 24 hours and 2 hours before service time.',
          enabled: true,
        },
        {
          id: 'cancellations',
          label: 'Cancellation alerts',
          description: 'Notify staff and customers when booking status changes.',
          enabled: true,
        },
        {
          id: 'daily-digest',
          label: 'Daily owner digest',
          description: 'Summarize bookings, no-shows, and payout status every evening.',
          enabled: false,
        },
      ],
      channel: 'Email + SMS',
      subject: 'Your booking with Slotra is confirmed',
      message: 'Hi {{customer_name}}, your appointment for {{service_name}} is confirmed on {{appointment_time}}. Reply if you need to reschedule.',
    },
    domain: {
      subdomain: 'businessname',
      activeIssueId: 'propagation',
    },
    booking: {
      leadTime: payments?.leadTime ?? '2 hours',
      cancellationWindow: payments?.cancellationWindow ?? '12 hours',
      bookingApproval: payments?.bookingApproval ?? 'Manual review',
      heroHeadline: `Book with ${business?.name ?? 'Your business'}`,
      heroSubcopy: 'Fast confirmations, clear policies, and a branded checkout experience.',
      sections: [
        { id: 'hero', label: 'Hero', description: 'Headline, trust badges, and CTA.', enabled: true },
        { id: 'services', label: 'Services', description: 'Service cards and durations.', enabled: true },
        { id: 'policies', label: 'Policies', description: 'Lead time, cancellation, and no-show policy.', enabled: true },
        { id: 'faq', label: 'FAQ', description: 'Common booking questions before checkout.', enabled: true },
        { id: 'staff', label: 'Staff highlight', description: 'Optional staff profiles and specialties.', enabled: false },
      ],
      intakeFields: [
        { id: 'full-name', label: 'Full name', placeholder: 'Enter your full name', enabled: true, required: true },
        { id: 'mobile', label: 'Mobile number', placeholder: '09xx xxx xxxx', enabled: true, required: true },
        { id: 'email', label: 'Email address', placeholder: 'name@email.com', enabled: true, required: false },
        { id: 'notes', label: 'Booking notes', placeholder: 'Allergies, preferences, or requests', enabled: true, required: false },
      ],
    },
    publish: {
      published: false,
    },
  };
}

function loadFromStorage(): OwnerSettingsPersistenceSnapshot | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as OwnerSettingsPersistenceSnapshot;
  } catch {
    return null;
  }
}

function saveToStorage(snapshot: OwnerSettingsPersistenceSnapshot) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(snapshot));
}

function updateSnapshot<K extends keyof OwnerSettingsPersistenceSnapshot>(
  sectionKey: K,
  value: OwnerSettingsPersistenceSnapshot[K]
): OwnerSettingsPersistenceSnapshot {
  const snapshot = loadFromStorage() ?? createDefaultSnapshot();
  const nextSnapshot = {
    ...snapshot,
    [sectionKey]: deepClone(value),
  };

  saveToStorage(nextSnapshot);
  return nextSnapshot;
}

export const ownerSettingsPersistenceClient: OwnerSettingsPersistenceClient = {
  async loadSnapshot() {
    await wait(160);
    return deepClone(loadFromStorage() ?? createDefaultSnapshot());
  },
  async saveBrand(draft) {
    await wait(180);
    updateSnapshot('brand', draft);
    return deepClone(draft);
  },
  async saveBusiness(draft) {
    await wait(180);
    updateSnapshot('business', draft);
    return deepClone(draft);
  },
  async saveTeam(draft) {
    await wait(180);
    updateSnapshot('team', draft);
    return deepClone(draft);
  },
  async saveNotifications(draft) {
    await wait(180);
    updateSnapshot('notifications', draft);
    return deepClone(draft);
  },
  async saveDomain(draft) {
    await wait(180);
    updateSnapshot('domain', draft);
    return deepClone(draft);
  },
  async saveBooking(draft) {
    await wait(180);
    updateSnapshot('booking', draft);
    return deepClone(draft);
  },
  async savePublish(draft) {
    await wait(180);
    updateSnapshot('publish', draft);
    return deepClone(draft);
  },
};

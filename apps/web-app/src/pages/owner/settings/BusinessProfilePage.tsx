import { Building2, Mail, MapPin, Phone, Save } from 'lucide-react';
import { useState } from 'react';
import { getOwnerBusinessSettingsResource } from '@/features/owner/data';
import { BrandButton, BrandInput, BrandSelect, BrandTextarea, Card, useBrandToast } from '@/ui';

export function BusinessProfilePage() {
  const toast = useBrandToast();
  const resource = getOwnerBusinessSettingsResource();
  const business = resource.status === 'ready' ? resource.data.business : null;
  const timezoneOptions = resource.status === 'ready' ? resource.data.timezoneOptions : ['Asia/Manila'];

  const [phone, setPhone] = useState(() => business?.phone ?? '');
  const [email, setEmail] = useState(() => business?.email ?? '');
  const [address, setAddress] = useState(() => business?.address ?? '');
  const [timezone, setTimezone] = useState(() => business?.timezone ?? 'Asia/Manila');
  const [businessNotes, setBusinessNotes] = useState(() => business?.arrivalNotes ?? '');

  function handleSaveProfile() {
    toast.success({
      title: 'Business profile saved',
      description: 'Contact details and operations notes were updated in this workspace draft.',
    });
  }

  return (
    <div className="settings-workspace-grid">
      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header settings-surface-card__header--compact">
          <div>
            <span className="settings-surface-card__eyebrow">Business profile</span>
            <h2 className="settings-surface-card__title">Core contact and location details</h2>
            <p className="settings-surface-card__description">
              Keep information consistent across booking pages, notifications, and staff operations.
            </p>
          </div>
          <Building2 size={16} aria-hidden="true" />
        </div>

        <div className="settings-form-grid settings-form-grid--two">
          <BrandInput
            label="Phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            helperText="Used in reminder templates and customer support cards."
            leadingIcon={Phone}
          />
          <BrandInput
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            helperText="Primary owner inbox for escalations and receipts."
            leadingIcon={Mail}
          />
          <BrandInput
            label="Address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            helperText="Displayed on booking confirmation summaries."
            leadingIcon={MapPin}
          />
          <BrandSelect
            label="Timezone"
            value={timezone}
            onChange={(event) => setTimezone(event.target.value)}
            helperText="Used for booking windows and notification schedules."
          >
            {timezoneOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </BrandSelect>
        </div>

        <BrandTextarea
          label="Arrival notes"
          rows={3}
          value={businessNotes}
          onChange={(event) => setBusinessNotes(event.target.value)}
          helperText="Add parking, landmark, or check-in notes shown before checkout."
        />

        <div className="settings-button-row settings-button-row--end">
          <BrandButton startIcon={<Save size={14} />} onClick={handleSaveProfile}>Save business profile</BrandButton>
        </div>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Button, FormField, SectionCard, Select, Textarea } from '@slotra/ui';
import { getOwnerBusinessSettingsResource } from '@/features/owner/data';

export function BusinessProfilePage() {
  const resource = getOwnerBusinessSettingsResource();
  const business = resource.status === 'ready' ? resource.data.business : null;
  const timezoneOptions = resource.status === 'ready' ? resource.data.timezoneOptions : ['Asia/Manila'];
  const [phone, setPhone] = useState(() => business?.phone ?? '');
  const [email, setEmail] = useState(() => business?.email ?? '');
  const [address, setAddress] = useState(() => business?.address ?? '');
  const [timezone, setTimezone] = useState(() => business?.timezone ?? 'Asia/Manila');
  const [businessNotes, setBusinessNotes] = useState(() => business?.arrivalNotes ?? '');

  return (
    <SectionCard title="Business profile" description="Core contact and location details used across owner operations.">
      <div className="owner-form-grid">
        <FormField label="Phone" htmlFor="business-phone">
          <input id="business-phone" className="input" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </FormField>
        <FormField label="Email" htmlFor="business-email">
          <input id="business-email" className="input" value={email} onChange={(event) => setEmail(event.target.value)} />
        </FormField>
        <FormField label="Address" htmlFor="business-address">
          <input id="business-address" className="input" value={address} onChange={(event) => setAddress(event.target.value)} />
        </FormField>
        <Select id="business-timezone" label="Timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)}>
          {timezoneOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        id="business-notes"
        label="Arrival notes"
        rows={3}
        value={businessNotes}
        onChange={(event) => setBusinessNotes(event.target.value)}
      />

      <div className="owner-form-actions">
        <Button type="button">Save business profile</Button>
      </div>
    </SectionCard>
  );
}

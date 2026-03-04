import { useState } from 'react';
import { Button, FormField, SectionCard, Select, Textarea } from '@slotra/ui';

export function BusinessProfilePage() {
  const [phone, setPhone] = useState('+63 917 555 1200');
  const [email, setEmail] = useState('hello@dheynsbarbershop.com');
  const [address, setAddress] = useState('Poblacion, Makati City');
  const [timezone, setTimezone] = useState('Asia/Manila');
  const [businessNotes, setBusinessNotes] = useState('Street parking is limited after 5 PM.');

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
          <option value="Asia/Manila">Asia/Manila</option>
          <option value="Asia/Singapore">Asia/Singapore</option>
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

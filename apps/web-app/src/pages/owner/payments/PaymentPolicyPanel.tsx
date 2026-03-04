import { Button, SectionCard, Select } from '@slotra/ui';

interface PaymentPolicyPanelProps {
  value: string;
  onChange: (value: string) => void;
}

export function PaymentPolicyPanel({ value, onChange }: PaymentPolicyPanelProps) {
  return (
    <SectionCard title="Booking payment policy" description="A simple owner-facing control instead of a fake payment dashboard.">
      <Select
        id="payment-policy"
        label="Default policy"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="Collect full payment in person">Collect full payment in person</option>
        <option value="Collect 50% deposit manually">Collect 50% deposit manually</option>
        <option value="Collect fixed PHP 500 deposit manually">Collect fixed PHP 500 deposit manually</option>
      </Select>

      <div className="owner-form-actions">
        <Button type="button">Save policy</Button>
        <Button type="button" variant="ghost">Share team instructions</Button>
      </div>
    </SectionCard>
  );
}

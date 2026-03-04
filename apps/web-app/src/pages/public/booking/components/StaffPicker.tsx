import { Badge, EmptyState } from '@slotra/ui';
import type { BookingService, BookingStaffMember } from '../types';

interface StaffPickerProps {
  service: BookingService;
  staffMembers: BookingStaffMember[];
  selectedStaffId: string | null;
  error?: string;
  onSelect: (staffId: string) => void;
}

export function StaffPicker({
  service,
  staffMembers,
  selectedStaffId,
  error,
  onSelect,
}: StaffPickerProps) {
  if (!staffMembers.length) {
    return (
      <EmptyState
        align="left"
        title="No staff available for this service"
        description="Try another service. The current mock catalog has no matching team members."
      />
    );
  }

  return (
    <div className="booking-stage-stack">
      <p className="booking-stage-copy">
        Choose who will handle <strong>{service.name}</strong>. Availability updates after staff
        selection.
      </p>
      <div className="booking-choice-grid">
        {staffMembers.map((staffMember) => {
          const isSelected = selectedStaffId === staffMember.id;

          return (
            <button
              key={staffMember.id}
              type="button"
              className={[
                'booking-choice-card',
                isSelected ? 'booking-choice-card--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelect(staffMember.id)}
            >
              <div className="booking-choice-card__top">
                <div>
                  <p className="booking-choice-card__eyebrow">{staffMember.role}</p>
                  <h3>{staffMember.name}</h3>
                </div>
                <Badge variant={isSelected ? 'accent' : 'info'}>{staffMember.badge}</Badge>
              </div>
              <p>{staffMember.bio}</p>
            </button>
          );
        })}
      </div>
      {error ? <p className="booking-inline-error">{error}</p> : null}
    </div>
  );
}

import { Badge, Button, FormField, SectionCard } from '@slotra/ui';
import type { TeamMemberRecord } from '../../mockOwnerData';

interface TeamSetupStepProps {
  team: TeamMemberRecord[];
  serviceOptions: string[];
  errors: Record<string, string>;
  onAddMember: () => void;
  onRemoveMember: (memberId: string) => void;
  onMemberChange: <K extends keyof TeamMemberRecord>(memberId: string, field: K, value: TeamMemberRecord[K]) => void;
}

export function TeamSetupStep({
  team,
  serviceOptions,
  errors,
  onAddMember,
  onRemoveMember,
  onMemberChange,
}: TeamSetupStepProps) {
  return (
    <SectionCard
      title="Staff and team"
      description="Capture the people who can accept bookings or support operations. Assignment stays local for now."
      actions={<Button type="button" variant="outline" onClick={onAddMember}>Add teammate</Button>}
    >
      {errors.team && <p className="onboarding-error-banner">{errors.team}</p>}

      <div className="owner-settings-stack">
        {team.map((member) => (
          <div key={member.id} className="onboarding-editor-card">
            <div className="onboarding-editor-card__header">
              <div>
                <p className="onboarding-editor-card__title">{member.name || 'New teammate'}</p>
                <p className="onboarding-editor-card__meta">{member.schedule || 'Schedule to be defined'}</p>
              </div>
              <div className="onboarding-editor-card__actions">
                <Badge variant={member.status === 'Active' ? 'success' : 'default'}>{member.status}</Badge>
                <Button type="button" variant="ghost" onClick={() => onRemoveMember(member.id)}>
                  Remove
                </Button>
              </div>
            </div>

            <div className="owner-form-grid">
              <FormField label="Name" htmlFor={`team-name-${member.id}`} error={errors[`team-name-${member.id}`]}>
                <input
                  id={`team-name-${member.id}`}
                  className="input"
                  value={member.name}
                  onChange={(event) => onMemberChange(member.id, 'name', event.target.value)}
                />
              </FormField>

              <FormField label="Role" htmlFor={`team-role-${member.id}`} error={errors[`team-role-${member.id}`]}>
                <input
                  id={`team-role-${member.id}`}
                  className="input"
                  value={member.role}
                  onChange={(event) => onMemberChange(member.id, 'role', event.target.value)}
                />
              </FormField>

              <FormField label="Schedule" htmlFor={`team-schedule-${member.id}`}>
                <input
                  id={`team-schedule-${member.id}`}
                  className="input"
                  value={member.schedule}
                  onChange={(event) => onMemberChange(member.id, 'schedule', event.target.value)}
                />
              </FormField>

              <FormField label="Assigned services" htmlFor={`team-services-${member.id}`} error={errors[`team-services-${member.id}`]}>
                <input
                  id={`team-services-${member.id}`}
                  className="input"
                  list={`team-service-options-${member.id}`}
                  value={member.services.join(', ')}
                  onChange={(event) =>
                    onMemberChange(
                      member.id,
                      'services',
                      event.target.value
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="Haircut & Style, Beard Trim"
                />
                <datalist id={`team-service-options-${member.id}`}>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </FormField>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

import { useState } from 'react';
import { Badge, Button, FormField, SectionCard } from '@slotra/ui';
import { TEAM_MEMBERS } from '../mockOwnerData';

export function TeamSettingsPage() {
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('');

  return (
    <div className="owner-settings-stack">
      <SectionCard title="Team roster" description="Staff setup stays local for now, but the structure matches future availability and booking assignment work.">
        <div className="owner-checklist">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="owner-checklist__item">
              <div>
                <p className="owner-checklist__title">{member.name}</p>
                <p className="owner-checklist__description">{member.role}</p>
                <p className="owner-checklist__meta">{member.schedule} · {member.services.join(', ')}</p>
              </div>
              <Badge variant={member.status === 'Active' ? 'success' : 'default'}>
                {member.status}
              </Badge>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Invite teammate" description="A lightweight owner action for MVP planning.">
        <div className="owner-form-grid">
          <FormField label="Name" htmlFor="team-name">
            <input id="team-name" className="input" value={inviteName} onChange={(event) => setInviteName(event.target.value)} />
          </FormField>
          <FormField label="Role" htmlFor="team-role">
            <input id="team-role" className="input" value={inviteRole} onChange={(event) => setInviteRole(event.target.value)} />
          </FormField>
        </div>
        <div className="owner-form-actions">
          <Button type="button">Save draft invite</Button>
        </div>
      </SectionCard>
    </div>
  );
}

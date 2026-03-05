import { Lock, Plus, Save, Shield, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { RouteStateCard } from '@/app/components/RouteStateCard';
import { getOwnerTeamResource } from '@/features/owner/data';
import { useUnsavedChangesGuard } from '@/features/forms/useUnsavedChangesGuard';
import { ownerSettingsPersistenceClient } from '@/features/owner/settings/persistenceClient';
import { BrandButton, BrandInput, BrandSelect, Card, SaveStateIndicator, useBrandToast, type SaveStateStatus } from '@/ui';

export function TeamSettingsPage() {
  const toast = useBrandToast();
  const resource = getOwnerTeamResource();
  const teamMembers = resource.status === 'ready' ? resource.data.teamMembers : [];

  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('Owner assistant');
  const [inviteEmail, setInviteEmail] = useState('');
  const [sessionTimeout, setSessionTimeout] = useState('30 minutes');
  const [require2fa, setRequire2fa] = useState(true);
  const [saveState, setSaveState] = useState<SaveStateStatus>('saved');
  const [lastSaved, setLastSaved] = useState('Waiting for first save');
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const activeMembers = teamMembers.filter((member) => member.status === 'Active').length;
  const inviteEmailError = useMemo(() => {
    if (!inviteEmail.trim()) {
      return 'Work email is required.';
    }
    if (!/^\S+@\S+\.\S+$/.test(inviteEmail.trim())) {
      return 'Use a valid email format.';
    }
    return '';
  }, [inviteEmail]);

  useUnsavedChangesGuard(saveState === 'idle' || saveState === 'failed');

  function markDirty() {
    setSaveState('idle');
  }

  async function loadTeamDraft() {
    setLoading(true);
    setLoadingError('');

    try {
      const snapshot = await ownerSettingsPersistenceClient.loadSnapshot();
      setInviteName(snapshot.team.invite.name);
      setInviteRole(snapshot.team.invite.role);
      setInviteEmail(snapshot.team.invite.email);
      setSessionTimeout(snapshot.team.security.sessionTimeout);
      setRequire2fa(snapshot.team.security.require2fa);
      setSaveState('saved');
      setLastSaved('Draft restored');
      setSubmitAttempted(false);
    } catch {
      setLoadingError('Could not load team settings draft. Retry to continue.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTeamDraft();
  }, []);

  async function persistTeamSettings() {
    setSaveState('saving');
    try {
      await ownerSettingsPersistenceClient.saveTeam({
        invite: {
          name: inviteName.trim(),
          role: inviteRole,
          email: inviteEmail.trim(),
        },
        security: {
          sessionTimeout,
          require2fa,
        },
      });
      setSaveState('saved');
      setLastSaved(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      return true;
    } catch {
      setSaveState('failed');
      toast.error({
        title: 'Save failed',
        description: 'Team settings were not saved. Retry to keep your latest changes.',
      });
      return false;
    }
  }

  async function handleSaveInvite() {
    setSubmitAttempted(true);
    if (inviteEmailError) {
      setSaveState('failed');
      return;
    }

    const saved = await persistTeamSettings();
    if (!saved) {
      return;
    }
    toast.success({
      title: 'Invite draft saved',
      description: 'Teammate draft was captured for later invite delivery flow.',
    });
  }

  async function handleSaveSecurity() {
    const saved = await persistTeamSettings();
    if (!saved) {
      return;
    }
    toast.success({
      title: 'Security settings saved',
      description: 'Session timeout and authentication requirements were updated in preview state.',
    });
  }

  if (loading) {
    return <RouteStateCard title="Loading team settings" description="Preparing team invite and security drafts." variant="loading" />;
  }

  if (loadingError) {
    return <RouteStateCard title="Team settings unavailable" description={loadingError} variant="error" onRetry={() => void loadTeamDraft()} />;
  }

  return (
    <div className="settings-workspace-grid">
      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header">
          <div>
            <span className="settings-surface-card__eyebrow">Team roster</span>
            <h2 className="settings-surface-card__title">Active members and responsibilities</h2>
            <p className="settings-surface-card__description">Keep staffing visibility clear before launch and daily operations.</p>
          </div>
          <span className="settings-status-pill settings-status-pill--success">{activeMembers}/{teamMembers.length} active</span>
        </div>

        <div className="team-member-list">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-member-item">
              <div>
                <p className="team-member-item__name">{member.name}</p>
                <p className="team-member-item__role">{member.role}</p>
                <p className="team-member-item__meta">{member.schedule} | {member.services.join(', ')}</p>
              </div>
              <span className={`settings-status-pill ${member.status === 'Active' ? 'settings-status-pill--success' : 'settings-status-pill--warning'}`}>
                {member.status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header settings-surface-card__header--compact">
          <div>
            <span className="settings-surface-card__eyebrow">Invite teammate</span>
            <h2 className="settings-surface-card__title">Add staff access draft</h2>
          </div>
          <Users size={16} aria-hidden="true" />
        </div>

        <div className="settings-form-grid settings-form-grid--three">
          <BrandInput
            label="Name"
            value={inviteName}
            onChange={(event) => { setInviteName(event.target.value); markDirty(); }}
            helperText="Display name shown in schedule assignment."
          />
          <BrandInput
            label="Work email"
            value={inviteEmail}
            error={submitAttempted ? inviteEmailError || undefined : undefined}
            onChange={(event) => { setInviteEmail(event.target.value); markDirty(); }}
            helperText="Used for invite delivery and login."
          />
          <BrandSelect label="Role" value={inviteRole} onChange={(event) => { setInviteRole(event.target.value); markDirty(); }}>
            <option value="Owner assistant">Owner assistant</option>
            <option value="Front desk">Front desk</option>
            <option value="Senior staff">Senior staff</option>
          </BrandSelect>
        </div>

        <div className="settings-button-row settings-button-row--end">
          <SaveStateIndicator status={saveState} savedLabel={lastSaved} onRetry={() => void persistTeamSettings()} />
          <BrandButton startIcon={<Plus size={14} />} onClick={() => void handleSaveInvite()} disabled={saveState === 'saving'}>Save invite draft</BrandButton>
        </div>
      </Card>

      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header settings-surface-card__header--compact">
          <div>
            <span className="settings-surface-card__eyebrow">Security</span>
            <h2 className="settings-surface-card__title">Access controls and session policy</h2>
          </div>
          <Shield size={16} aria-hidden="true" />
        </div>

        <div className="settings-form-grid settings-form-grid--two">
          <BrandSelect
            label="Session timeout"
            value={sessionTimeout}
            onChange={(event) => { setSessionTimeout(event.target.value); markDirty(); }}
            helperText="Auto-sign out idle sessions for shared devices."
            leadingIcon={Lock}
          >
            <option value="15 minutes">15 minutes</option>
            <option value="30 minutes">30 minutes</option>
            <option value="60 minutes">60 minutes</option>
          </BrandSelect>
          <label className="settings-inline-toggle">
            <input
              checked={require2fa}
              className="settings-checkbox"
              type="checkbox"
              onChange={(event) => {
                setRequire2fa(event.target.checked);
                markDirty();
              }}
            />
            <span>
              <strong>Require 2-step verification</strong>
              <small>Prompt team members for secondary verification on new devices.</small>
            </span>
          </label>
        </div>

        <div className="settings-button-row settings-button-row--end">
          <BrandButton startIcon={<Save size={14} />} onClick={() => void handleSaveSecurity()} disabled={saveState === 'saving'}>Save security controls</BrandButton>
        </div>
      </Card>

      <Card className="settings-surface-card" padding={5}>
        <div className="settings-surface-card__header settings-surface-card__header--compact">
          <div>
            <span className="settings-surface-card__eyebrow">Billing</span>
            <h2 className="settings-surface-card__title">Workspace plan visibility</h2>
          </div>
        </div>

        <div className="settings-billing-shell">
          <p><strong>Starter Workspace</strong> | Renews on March 20, 2026</p>
          <p>Included: 5 staff seats, 500 monthly booking notifications, and branded booking link.</p>
          <div className="settings-button-row">
            <BrandButton variant="secondary">View billing history</BrandButton>
            <BrandButton variant="secondary">Manage plan</BrandButton>
          </div>
        </div>
      </Card>
    </div>
  );
}

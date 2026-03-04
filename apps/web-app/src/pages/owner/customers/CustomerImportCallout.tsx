import { Badge, SectionCard } from '@slotra/ui';

export function CustomerImportCallout() {
  return (
    <SectionCard
      title="Import options"
      description="These are still mock affordances for MVP planning and are not connected to live providers yet."
      actions={<Badge variant="warning">Mock only</Badge>}
    >
      <div className="customer-import-grid">
        <div className="customer-import-card">
          <p className="customer-import-card__title">CSV import</p>
          <p className="customer-import-card__description">
            Define the expected columns and keep the upload workflow scoped for a later phase.
          </p>
        </div>
        <div className="customer-import-card">
          <p className="customer-import-card__title">Google Contacts</p>
          <p className="customer-import-card__description">
            Useful later, but intentionally deferred until authentication and sync rules exist.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

import { Button, PageHeader } from '@slotra/ui';

export function CustomersPage() {
  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="View and manage your customer base."
        actions={<Button variant="primary" size="sm">+ Add Customer</Button>}
      />

      {/* Empty state */}
      <div className="cust-empty-shell">
        {/* Icon */}
        <div className="cust-empty-icon">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
            <circle cx="24" cy="18" r="8" />
            <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="cust-empty-title">No customers yet</h2>
        <p className="cust-empty-desc">Import your existing customer list or add them one by one.</p>

        {/* Import option cards */}
        <div className="cust-import-grid">
          {/* CSV import */}
          <button className="cust-import-card">
            <div className="cust-import-card__icon cust-import-card__icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="28" height="28">
                <path d="M9 13h6m-3-3v6M4 6h16M4 10h16M4 14h10M4 18h10" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="3" width="18" height="18" rx="3" />
              </svg>
            </div>
            <div>
              <p className="cust-import-card__title">Import from CSV</p>
              <p className="cust-import-card__desc">Upload a .csv file with name, email, and phone columns.</p>
            </div>
            <svg className="cust-import-card__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Google Contacts */}
          <button className="cust-import-card">
            <div className="cust-import-card__icon cust-import-card__icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="28" height="28">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="cust-import-card__title">Import from Google Contacts</p>
              <p className="cust-import-card__desc">Connect your Google account to sync contacts instantly.</p>
            </div>
            <svg className="cust-import-card__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Manual link */}
        <p className="cust-empty-manual">
          Prefer to start fresh?{' '}
          <button className="cust-empty-link" onClick={() => { }}>Add a customer manually</button>
        </p>
      </div>
    </div>
  );
}

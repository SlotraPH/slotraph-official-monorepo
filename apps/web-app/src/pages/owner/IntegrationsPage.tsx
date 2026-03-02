import { useState } from 'react';
import { Badge } from '@slotra/ui';

// ── Mock Data ──────────────────────────────────────────────────────────
interface Integration {
    id: string;
    name: string;
    desc: string;
    category: string;
    connected: boolean;
    icon: string; // emoji / letter placeholder
    iconBg: string;
}

const INTEGRATIONS: Integration[] = [
    // Calendars
    { id: 'gcal', name: 'Google Calendar', desc: 'Sync appointments automatically with Google Calendar.', category: 'Calendars', connected: true, icon: 'G', iconBg: '#4285F4' },
    { id: 'outlook', name: 'Outlook Calendar', desc: 'Sync with Microsoft Outlook and Teams.', category: 'Calendars', connected: false, icon: 'O', iconBg: '#0078D4' },
    // Payments
    { id: 'gcash', name: 'GCash', desc: 'Accept payments via GCash e-wallet.', category: 'Payments', connected: true, icon: '₱', iconBg: '#0070E0' },
    { id: 'maya', name: 'Maya (PayMaya)', desc: 'Accept payments via Maya digital wallet.', category: 'Payments', connected: false, icon: 'M', iconBg: '#00A651' },
    { id: 'stripe', name: 'Stripe', desc: 'Accept credit/debit cards via Stripe.', category: 'Payments', connected: false, icon: 'S', iconBg: '#635BFF' },
    // Messaging
    { id: 'viber', name: 'Viber', desc: 'Send appointment reminders via Viber.', category: 'Messaging', connected: false, icon: 'V', iconBg: '#7360F2' },
    { id: 'whatsapp', name: 'WhatsApp', desc: 'Automated appointment confirmations on WhatsApp.', category: 'Messaging', connected: false, icon: 'W', iconBg: '#25D366' },
    // CRM
    { id: 'hubspot', name: 'HubSpot', desc: 'Sync customers and bookings with your CRM.', category: 'CRM', connected: false, icon: 'H', iconBg: '#FF7A59' },
];

const CATEGORIES = ['Calendars', 'Payments', 'Messaging', 'CRM'];

export function IntegrationsPage() {
    const [query, setQuery] = useState('');

    const filtered = INTEGRATIONS.filter(i =>
        i.name.toLowerCase().includes(query.toLowerCase()) ||
        i.desc.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-header__title">Integrations</h1>
                    <p className="page-header__subtitle">Connect third-party tools and services to your workflow.</p>
                </div>
            </div>

            {/* Search */}
            <div className="intg-search-wrap">
                <svg className="intg-search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <circle cx="8.5" cy="8.5" r="5.25" />
                    <path d="M12.5 12.5L17 17" strokeLinecap="round" />
                </svg>
                <input
                    className="input intg-search-input"
                    type="search"
                    placeholder="Search integrations…"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
            </div>

            {/* Sections */}
            {CATEGORIES.map(cat => {
                const items = filtered.filter(i => i.category === cat);
                if (items.length === 0) return null;
                return (
                    <div key={cat} className="intg-section">
                        <h2 className="intg-section-title">{cat}</h2>
                        <div className="intg-grid">
                            {items.map(intg => (
                                <div key={intg.id} className="intg-card card card--padded">
                                    <div className="intg-card__top">
                                        {/* Icon */}
                                        <div
                                            className="intg-icon"
                                            style={{ background: intg.iconBg }}
                                        >
                                            {intg.icon}
                                        </div>
                                        {/* Connected badge */}
                                        {intg.connected && (
                                            <Badge variant="success">Connected</Badge>
                                        )}
                                    </div>
                                    <p className="intg-card__name">{intg.name}</p>
                                    <p className="intg-card__desc">{intg.desc}</p>
                                    <button
                                        className={`btn btn--sm intg-card__btn ${intg.connected ? 'btn--outline intg-card__btn--disconnect' : 'btn--primary'}`}
                                    >
                                        {intg.connected ? 'Disconnect' : 'Connect'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

import { useState } from 'react';
import { Badge, Button, Card, PageHeader } from '@slotra/ui';

interface Integration {
    id: string;
    name: string;
    desc: string;
    category: string;
    connected: boolean;
    icon: string;
    iconBg: string;
}

const INTEGRATIONS: Integration[] = [
    { id: 'gcal', name: 'Google Calendar', desc: 'Sync appointments automatically with Google Calendar.', category: 'Calendars', connected: true, icon: 'G', iconBg: '#4285F4' },
    { id: 'outlook', name: 'Outlook Calendar', desc: 'Sync with Microsoft Outlook and Teams.', category: 'Calendars', connected: false, icon: 'O', iconBg: '#0078D4' },
    { id: 'gcash', name: 'GCash', desc: 'Accept payments via GCash e-wallet.', category: 'Payments', connected: true, icon: 'P', iconBg: '#0070E0' },
    { id: 'maya', name: 'Maya (PayMaya)', desc: 'Accept payments via Maya digital wallet.', category: 'Payments', connected: false, icon: 'M', iconBg: '#00A651' },
    { id: 'stripe', name: 'Stripe', desc: 'Accept credit/debit cards via Stripe.', category: 'Payments', connected: false, icon: 'S', iconBg: '#635BFF' },
    { id: 'viber', name: 'Viber', desc: 'Send appointment reminders via Viber.', category: 'Messaging', connected: false, icon: 'V', iconBg: '#7360F2' },
    { id: 'whatsapp', name: 'WhatsApp', desc: 'Automated appointment confirmations on WhatsApp.', category: 'Messaging', connected: false, icon: 'W', iconBg: '#25D366' },
    { id: 'hubspot', name: 'HubSpot', desc: 'Sync customers and bookings with your CRM.', category: 'CRM', connected: false, icon: 'H', iconBg: '#FF7A59' },
];

const CATEGORIES = ['Calendars', 'Payments', 'Messaging', 'CRM'];

export function IntegrationsPage() {
    const [query, setQuery] = useState('');

    const filtered = INTEGRATIONS.filter((integration) =>
        integration.name.toLowerCase().includes(query.toLowerCase())
        || integration.desc.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div>
            <PageHeader
                title="Integrations"
                subtitle="Connect third-party tools and services to your workflow."
            />

            <div className="intg-search-wrap">
                <svg className="intg-search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <circle cx="8.5" cy="8.5" r="5.25" />
                    <path d="M12.5 12.5L17 17" strokeLinecap="round" />
                </svg>
                <input
                    className="input intg-search-input"
                    type="search"
                    placeholder="Search integrations..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>

            {CATEGORIES.map((category) => {
                const items = filtered.filter((integration) => integration.category === category);
                if (items.length === 0) return null;

                return (
                    <div key={category} className="intg-section">
                        <h2 className="intg-section-title">{category}</h2>
                        <div className="intg-grid">
                            {items.map((integration) => (
                                <Card key={integration.id} className="intg-card">
                                    <div className="intg-card__top">
                                        <div
                                            className="intg-icon"
                                            style={{ background: integration.iconBg }}
                                        >
                                            {integration.icon}
                                        </div>
                                        {integration.connected && (
                                            <Badge variant="success">Connected</Badge>
                                        )}
                                    </div>
                                    <p className="intg-card__name">{integration.name}</p>
                                    <p className="intg-card__desc">{integration.desc}</p>
                                    <Button
                                        variant={integration.connected ? 'outline' : 'primary'}
                                        size="sm"
                                        className={`intg-card__btn ${integration.connected ? 'intg-card__btn--disconnect' : ''}`}
                                    >
                                        {integration.connected ? 'Disconnect' : 'Connect'}
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

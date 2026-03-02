import { Button, Badge } from '@slotra/ui';

// ── Mock Data ──────────────────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DATES = [24, 25, 26, 27, 28, 29, 30];
const TODAY_IDX = 2; // Wednesday

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8am – 8pm

interface CalEvent {
    day: number;
    startHour: number;
    durationHours: number;
    title: string;
    customer: string;
    color: string;
}

const MOCK_EVENTS: CalEvent[] = [
    { day: 0, startHour: 9, durationHours: 1, title: 'Haircut', customer: 'Marco R.', color: '#4f46e5' },
    { day: 0, startHour: 11, durationHours: 1.5, title: 'Beard Trim', customer: 'Luis D.', color: '#0ea5e9' },
    { day: 2, startHour: 10, durationHours: 2, title: 'Highlights', customer: 'Anna M.', color: '#8b5cf6' },
    { day: 2, startHour: 14, durationHours: 1, title: 'Manicure', customer: 'Sonia G.', color: '#10b981' },
    { day: 3, startHour: 9, durationHours: 1, title: 'Haircut', customer: 'Jake P.', color: '#4f46e5' },
    { day: 4, startHour: 13, durationHours: 1.5, title: 'Color & Style', customer: 'Maria L.', color: '#f59e0b' },
    { day: 5, startHour: 10, durationHours: 1, title: 'Beard Trim', customer: 'Carlos V.', color: '#0ea5e9' },
];

const CELL_HEIGHT = 64; // px per hour

export function CalendarPage() {
    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-header__title">Calendar</h1>
                    <p className="page-header__subtitle">Week of Mar 24 – 30, 2025</p>
                </div>
                <div className="page-header__actions">
                    <Button variant="outline" size="sm">Today</Button>
                    <div className="cal-nav-group">
                        <button className="cal-nav-btn" aria-label="Previous week">‹</button>
                        <button className="cal-nav-btn" aria-label="Next week">›</button>
                    </div>
                    <Badge variant="accent">Week</Badge>
                    <Button variant="primary" size="sm">+ New Appointment</Button>
                </div>
            </div>

            {/* Calendar shell */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Day headers */}
                <div className="cal-header">
                    <div className="cal-time-gutter" />
                    {DAYS.map((day, i) => (
                        <div key={day} className={`cal-day-header ${i === TODAY_IDX ? 'cal-day-header--today' : ''}`}>
                            <span className="cal-day-label">{day}</span>
                            <span className={`cal-day-date ${i === TODAY_IDX ? 'cal-day-date--today' : ''}`}>{DATES[i]}</span>
                        </div>
                    ))}
                </div>

                {/* Scrollable grid body */}
                <div className="cal-body">
                    {/* Time column + day columns */}
                    <div className="cal-grid">
                        {/* Time labels */}
                        <div className="cal-time-col">
                            {HOURS.map(h => (
                                <div key={h} className="cal-time-cell">
                                    <span className="cal-time-label">
                                        {h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Day columns */}
                        {DAYS.map((day, dayIdx) => (
                            <div key={day} className={`cal-col ${dayIdx === TODAY_IDX ? 'cal-col--today' : ''}`}>
                                {/* Hour rows */}
                                {HOURS.map(h => (
                                    <div key={h} className="cal-hour-row" />
                                ))}

                                {/* Events */}
                                {MOCK_EVENTS.filter(e => e.day === dayIdx).map((ev, ei) => {
                                    const top = (ev.startHour - (HOURS[0] ?? 8)) * CELL_HEIGHT;
                                    const height = ev.durationHours * CELL_HEIGHT - 4;
                                    return (
                                        <div
                                            key={ei}
                                            className="cal-event"
                                            style={{
                                                top: top + 2,
                                                height,
                                                borderLeftColor: ev.color,
                                                background: `${ev.color}18`,
                                            }}
                                        >
                                            <span className="cal-event__title" style={{ color: ev.color }}>{ev.title}</span>
                                            <span className="cal-event__customer">{ev.customer}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

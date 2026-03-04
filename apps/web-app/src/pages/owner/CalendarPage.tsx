import { Badge, Button, Card, PageHeader } from '@slotra/ui';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DATES = [24, 25, 26, 27, 28, 29, 30];
const TODAY_IDX = 2; // Wednesday

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8am - 8pm

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
            <PageHeader
                title="Calendar"
                subtitle="Week of Mar 24 - 30, 2025"
                actions={
                    <>
                        <Button variant="outline" size="sm">Today</Button>
                        <div className="cal-nav-group">
                            <button className="cal-nav-btn" aria-label="Previous week" type="button">{'<'}</button>
                            <button className="cal-nav-btn" aria-label="Next week" type="button">{'>'}</button>
                        </div>
                        <Badge variant="accent">Week</Badge>
                        <Button variant="primary" size="sm">+ New Appointment</Button>
                    </>
                }
            />

            <Card padded={false} style={{ overflow: 'hidden' }}>
                <div className="cal-header">
                    <div className="cal-time-gutter" />
                    {DAYS.map((day, i) => (
                        <div key={day} className={`cal-day-header ${i === TODAY_IDX ? 'cal-day-header--today' : ''}`}>
                            <span className="cal-day-label">{day}</span>
                            <span className={`cal-day-date ${i === TODAY_IDX ? 'cal-day-date--today' : ''}`}>{DATES[i]}</span>
                        </div>
                    ))}
                </div>

                <div className="cal-body">
                    <div className="cal-grid">
                        <div className="cal-time-col">
                            {HOURS.map((hour) => (
                                <div key={hour} className="cal-time-cell">
                                    <span className="cal-time-label">
                                        {hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {DAYS.map((day, dayIdx) => (
                            <div key={day} className={`cal-col ${dayIdx === TODAY_IDX ? 'cal-col--today' : ''}`}>
                                {HOURS.map((hour) => (
                                    <div key={hour} className="cal-hour-row" />
                                ))}

                                {MOCK_EVENTS.filter((event) => event.day === dayIdx).map((event, eventIdx) => {
                                    const top = (event.startHour - (HOURS[0] ?? 8)) * CELL_HEIGHT;
                                    const height = event.durationHours * CELL_HEIGHT - 4;
                                    return (
                                        <div
                                            key={eventIdx}
                                            className="cal-event"
                                            style={{
                                                top: top + 2,
                                                height,
                                                borderLeftColor: event.color,
                                                background: `${event.color}18`,
                                            }}
                                        >
                                            <span className="cal-event__title" style={{ color: event.color }}>{event.title}</span>
                                            <span className="cal-event__customer">{event.customer}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card } from '@slotra/ui';
import { AppPill, PageIntro } from '@/app/components/PageTemplates';
import { BrandButton } from '@/ui';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DATES = [24, 25, 26, 27, 28, 29, 30];
const TODAY_IDX = 2;
const HOURS = Array.from({ length: 13 }, (_, index) => index + 8);

interface CalEvent {
  color: string;
  customer: string;
  day: number;
  durationHours: number;
  startHour: number;
  title: string;
}

const MOCK_EVENTS: CalEvent[] = [
  { day: 0, startHour: 9, durationHours: 1, title: 'Haircut', customer: 'Marco R.', color: '#2e3192' },
  { day: 0, startHour: 11, durationHours: 1.5, title: 'Beard Trim', customer: 'Luis D.', color: '#5f6b7d' },
  { day: 2, startHour: 10, durationHours: 2, title: 'Highlights', customer: 'Anna M.', color: '#4a5668' },
  { day: 2, startHour: 14, durationHours: 1, title: 'Manicure', customer: 'Sonia G.', color: '#252880' },
  { day: 3, startHour: 9, durationHours: 1, title: 'Haircut', customer: 'Jake P.', color: '#2e3192' },
  { day: 4, startHour: 13, durationHours: 1.5, title: 'Color & Style', customer: 'Maria L.', color: '#7a8799' },
  { day: 5, startHour: 10, durationHours: 1, title: 'Beard Trim', customer: 'Carlos V.', color: '#4a5668' },
];

const CELL_HEIGHT = 64;

export function CalendarPage() {
  return (
    <div className="owner-page-stack">
      <PageIntro
        eyebrow="Scheduling"
        title="Weekly calendar"
        description="Use the shared workspace shell to scan availability, review the current week, and keep new bookings visible against the same spacing and typography system."
        actions={(
          <div className="owner-page-intro__actions-row">
            <BrandButton size="nav" variant="secondary">Today</BrandButton>
            <div className="cal-nav-group">
              <button aria-label="Previous week" className="cal-nav-btn" type="button">
                <ChevronLeft size={16} />
              </button>
              <button aria-label="Next week" className="cal-nav-btn" type="button">
                <ChevronRight size={16} />
              </button>
            </div>
            <BrandButton size="nav" startIcon={<Plus size={15} />}>New appointment</BrandButton>
          </div>
        )}
        pills={(
          <>
            <AppPill tone="accent">Week of Mar 24 - 30, 2025</AppPill>
            <AppPill>Live owner preview</AppPill>
          </>
        )}
      />

      <Card padded={false} style={{ overflow: 'hidden' }}>
        <div className="cal-header">
          <div className="cal-time-gutter" />
          {DAYS.map((day, index) => (
            <div key={day} className={`cal-day-header ${index === TODAY_IDX ? 'cal-day-header--today' : ''}`}>
              <span className="cal-day-label">{day}</span>
              <span className={`cal-day-date ${index === TODAY_IDX ? 'cal-day-date--today' : ''}`}>{DATES[index]}</span>
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
                        background: `${event.color}14`,
                        borderLeftColor: event.color,
                        height,
                        top: top + 2,
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

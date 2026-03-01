import { Link } from 'react-router-dom';

export function BookingConfirmationPage() {
  return (
    <main className="public-page">
      <section className="page-section page-section--narrow">
        <p className="page-section__eyebrow">Public Booking</p>
        <h1>Booking confirmation</h1>
        <p>This placeholder stands in for the confirmation state after a successful booking.</p>
        <p>It confirms a second public route can render without the owner shell.</p>
        <div className="hero-card__actions">
          <Link className="button-link" to="/book">
            Return to Booking
          </Link>
        </div>
      </section>
    </main>
  );
}

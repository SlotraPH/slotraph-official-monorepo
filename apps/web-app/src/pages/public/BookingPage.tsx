import { Link } from 'react-router-dom';

export function BookingPage() {
  return (
    <main className="public-page">
      <section className="page-section page-section--narrow">
        <p className="page-section__eyebrow">Public Booking</p>
        <h1>Book an appointment</h1>
        <p>This public route will become the customer-facing booking experience.</p>
        <p>For now it confirms the booking page renders outside the owner layout.</p>
        <div className="hero-card__actions">
          <Link className="button-link" to="/book/confirmation">
            View Confirmation Placeholder
          </Link>
          <Link className="button-link button-link--secondary" to="/">
            Back Home
          </Link>
        </div>
      </section>
    </main>
  );
}

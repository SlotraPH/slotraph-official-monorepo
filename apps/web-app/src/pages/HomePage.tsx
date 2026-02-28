import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <main className="public-page public-page--centered">
      <div className="hero-card">
        <p className="hero-card__eyebrow">Slotra MVP</p>
        <h1 className="hero-card__title">Choose an entry point</h1>
        <p className="hero-card__description">
          Start from the owner dashboard shell or view the public booking placeholder.
        </p>
        <div className="hero-card__actions">
          <Link className="button-link" to="/owner/dashboard">
            Go to Owner Dashboard
          </Link>
          <Link className="button-link button-link--secondary" to="/book">
            Go to Public Booking
          </Link>
        </div>
      </div>
    </main>
  );
}

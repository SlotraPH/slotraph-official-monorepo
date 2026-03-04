import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <main className="public-page public-page--centered">
      <div className="hero-card">
        <p className="hero-card__eyebrow">Slotra MVP</p>
        <h1 className="hero-card__title">Choose an entry point</h1>
        <p className="hero-card__description">
          Start owner setup, jump into the owner workspace, or preview the public booking journey.
        </p>
        <div className="hero-card__actions">
          <Link className="button-link" to="/owner/dashboard">
            Go to Owner Dashboard
          </Link>
          <Link className="button-link button-link--secondary" to="/owner/onboarding">
            Start Owner Onboarding
          </Link>
          <Link className="button-link button-link--secondary" to="/book">
            Go to Public Booking
          </Link>
          <Link className="button-link button-link--secondary" to="/sandbox">
            Open Sandbox
          </Link>
        </div>
      </div>
    </main>
  );
}

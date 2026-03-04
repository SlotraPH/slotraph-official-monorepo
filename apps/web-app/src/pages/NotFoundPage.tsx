import { Card, EmptyState } from '@slotra/ui';
import { Link } from 'react-router-dom';

interface NotFoundPageProps {
  context?: 'owner' | 'public';
}

export function NotFoundPage({ context = 'public' }: NotFoundPageProps) {
  const isOwner = context === 'owner';

  return (
    <main className={isOwner ? 'owner-page-stack' : 'public-page public-page--centered'}>
      <Card>
        <EmptyState
          align="left"
          title={isOwner ? 'Owner page not found' : 'Page not found'}
          description={
            isOwner
              ? 'That owner route does not exist or has not been wired into the shell yet.'
              : 'The route you entered does not exist in the current web app build.'
          }
          actions={(
            <>
              <Link className="button-link" to={isOwner ? '/owner/dashboard' : '/'}>
                {isOwner ? 'Go to owner dashboard' : 'Go to home'}
              </Link>
              <Link className="button-link button-link--secondary" to="/book">
                Open booking flow
              </Link>
            </>
          )}
        />
      </Card>
    </main>
  );
}

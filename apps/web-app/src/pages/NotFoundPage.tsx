import { Link } from 'react-router-dom';
import { Compass, Home, LayoutDashboard } from 'lucide-react';
import { AppShell } from '@/app/components/AppShell';
import { HeroSection } from '@/app/components/PageTemplates';
import { BrandButton } from '@/ui';

interface NotFoundPageProps {
  context?: 'owner' | 'public';
}

export function NotFoundPage({ context = 'public' }: NotFoundPageProps) {
  const isOwner = context === 'owner';

  return (
    <AppShell>
      <HeroSection
        eyebrow={isOwner ? 'Owner route' : 'Public route'}
        title={isOwner ? 'This owner page is not wired into the workspace.' : 'The requested page does not exist in this build.'}
        description={
          isOwner
            ? 'The route is outside the current owner workspace map or still pending a feature-level implementation in a later phase.'
            : 'Use one of the current product routes below to return to a live surface in the web app.'
        }
        actions={(
          <>
            <Link style={{ textDecoration: 'none' }} to={isOwner ? '/owner/dashboard' : '/'}>
              <BrandButton startIcon={isOwner ? <LayoutDashboard size={15} /> : <Home size={15} />}>
                {isOwner ? 'Go to owner dashboard' : 'Go to home'}
              </BrandButton>
            </Link>
            <Link style={{ textDecoration: 'none' }} to="/book">
              <BrandButton startIcon={<Compass size={15} />} variant="secondary">
                Open booking flow
              </BrandButton>
            </Link>
          </>
        )}
        aside={null}
      />
    </AppShell>
  );
}

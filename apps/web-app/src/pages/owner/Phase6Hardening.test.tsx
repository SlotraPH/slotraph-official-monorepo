import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { BillingWorkspace } from '@/modules/billing/BillingWorkspace';
import { SchedulingWorkspace } from '@/modules/scheduling/SchedulingWorkspace';
import { ToastProvider } from '@/ui';
import { IntegrationsPage } from './IntegrationsPage';
import { OnboardingFlow } from './onboarding/OnboardingFlow';

describe('Phase 6 hardening coverage', () => {
  it('opens onboarding step editor from the launchpad CTA', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <OnboardingFlow />
      </MemoryRouter>,
    );

    await user.click(await screen.findByRole('button', { name: 'Open step editor' }));

    expect(await screen.findByText('Step-by-step setup')).toBeInTheDocument();
  });

  it('surfaces timezone drift guidance in scheduling workspace', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastProvider>
          <SchedulingWorkspace />
        </ToastProvider>
      </MemoryRouter>,
    );

    await user.selectOptions(await screen.findByLabelText('Booking timezone'), 'Asia/Singapore');

    expect(await screen.findByText(/Timezone preview changed to Asia\/Singapore/i)).toBeInTheDocument();
  });

  it('shows undo action after changing payment status', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastProvider>
          <BillingWorkspace />
        </ToastProvider>
      </MemoryRouter>,
    );

    await user.click(await screen.findByRole('button', { name: 'Mark paid' }));

    expect(await screen.findByRole('button', { name: 'Undo status' })).toBeInTheDocument();
  });

  it('updates provider action state after connecting a disconnected integration', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastProvider>
          <IntegrationsPage />
        </ToastProvider>
      </MemoryRouter>,
    );

    const providerTitle = await screen.findByRole('heading', { name: 'WhatsApp Reminders' });
    const providerCard = providerTitle.closest('article');
    expect(providerCard).not.toBeNull();
    if (!providerCard) {
      return;
    }

    await user.click(within(providerCard).getByRole('button', { name: 'Connect provider' }));

    expect(await within(providerCard).findByRole('button', { name: 'Sync now' })).toBeInTheDocument();
    expect(within(providerCard).queryByRole('button', { name: 'Connect provider' })).not.toBeInTheDocument();
  });
});

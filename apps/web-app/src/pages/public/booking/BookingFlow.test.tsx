import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { BookingFlow } from './BookingFlow';

describe('BookingFlow', () => {
  it('blocks continuation until a service is selected', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BookingFlow />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getAllByText('Choose a service before continuing.').length).toBeGreaterThan(0);
  });

  it('skips the staff step for services that use the next available specialist', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BookingFlow />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /Scalp Reset Treatment/i }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByText('Pick a date')).toBeInTheDocument();
    expect(screen.queryByText('Choose your staff member')).not.toBeInTheDocument();
  });

  it('keeps the staff step for services that require a named specialist', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BookingFlow />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /Signature Cut \+ Finish/i }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByText('Choose your staff member')).toBeInTheDocument();
  });
});

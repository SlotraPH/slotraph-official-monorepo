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

    expect(screen.getByText('Assign the right staff member')).toBeInTheDocument();
  });

  it('validates customer fields on blur and clears the error after a valid change', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BookingFlow />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /Scalp Reset Treatment/i }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    const slotButton = screen.getAllByRole('button').find((button) => {
      return button.textContent?.includes('Available') && !button.hasAttribute('disabled');
    });
    expect(slotButton).toBeDefined();
    await user.click(slotButton!);
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    const nameInput = screen.getByLabelText('Full name');
    await user.click(nameInput);
    await user.tab();

    expect(screen.getByText('Enter the customer name.')).toBeInTheDocument();

    await user.type(nameInput, 'Arielle Cruz');

    expect(screen.queryByText('Enter the customer name.')).not.toBeInTheDocument();
  });

  it('blocks date-step continuation while availability is still loading', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BookingFlow />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /Scalp Reset Treatment/i }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByText('Availability is still syncing. Wait for dates to finish loading.')).toBeInTheDocument();
  });
});

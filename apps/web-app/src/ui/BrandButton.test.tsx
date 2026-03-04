import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BrandButton } from './BrandButton';

describe('BrandButton', () => {
  it('renders children and forwards clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<BrandButton onClick={onClick}>Save changes</BrandButton>);

    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies the requested variant marker', () => {
    render(<BrandButton variant="secondary">Secondary</BrandButton>);

    expect(screen.getByRole('button', { name: 'Secondary' })).toHaveAttribute('data-variant', 'secondary');
  });
});

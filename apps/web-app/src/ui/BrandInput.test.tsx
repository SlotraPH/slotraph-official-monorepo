import { render, screen } from '@testing-library/react';
import { Mail } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { BrandInput } from './BrandInput';

describe('BrandInput', () => {
  it('associates the label and helper text with the input', () => {
    render(
      <BrandInput
        helperText="We only use this for booking updates."
        label="Email"
        leadingIcon={Mail}
      />,
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('We only use this for booking updates.')).toBeInTheDocument();
  });

  it('marks the field invalid when an error is present', () => {
    render(<BrandInput error="Email is required." label="Email" />);

    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
  });
});

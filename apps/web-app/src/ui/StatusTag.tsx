import type { HTMLAttributes } from 'react';
import { cx } from './helpers';

export type StatusTagTone = 'positive' | 'neutral' | 'critical' | 'accent';

interface StatusTagProps extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  tone?: StatusTagTone;
}

export function StatusTag({ className, text, tone = 'neutral', ...props }: StatusTagProps) {
  return (
    <span
      {...props}
      className={cx('status-tag', `status-tag--${tone}`, className)}
    >
      {text}
    </span>
  );
}

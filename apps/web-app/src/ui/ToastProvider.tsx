import { Toaster, sileo } from 'sileo';
import type { PropsWithChildren } from 'react';
import type { SileoOptions } from 'sileo';

const baseToastOptions = {
  fill: '#0f1f2e',
  roundness: 14,
  styles: {
    badge: '!bg-white/10',
    description: '!text-white/60',
    title: '!text-white',
  },
} satisfies Partial<SileoOptions>;

export function ToastProvider({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <Toaster position="bottom-left" options={baseToastOptions} />
    </>
  );
}

export function useBrandToast() {
  return {
    show: (options: SileoOptions) => sileo.show({ ...baseToastOptions, ...options }),
    success: (options: SileoOptions) => sileo.success({ ...baseToastOptions, ...options }),
    error: (options: SileoOptions) => sileo.error({ ...baseToastOptions, ...options }),
    info: (options: SileoOptions) => sileo.info({ ...baseToastOptions, ...options }),
    warning: (options: SileoOptions) => sileo.warning({ ...baseToastOptions, ...options }),
  };
}

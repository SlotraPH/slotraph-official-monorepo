export interface ClientIntakeDraft {
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}

export type ClientIntakeErrors = Partial<Record<keyof ClientIntakeDraft, string>>;

export function validateClientIntakeField(draft: ClientIntakeDraft, field: keyof ClientIntakeDraft) {
  switch (field) {
    case 'fullName':
      return draft.fullName.trim() ? undefined : 'Enter the client name.';
    case 'email':
      if (!draft.email.trim()) {
        return 'Enter an email address.';
      }
      return /\S+@\S+\.\S+/.test(draft.email) ? undefined : 'Enter a valid email address.';
    case 'phone': {
      const digits = draft.phone.replace(/\D/g, '');
      if (!digits) {
        return 'Enter a mobile number.';
      }
      return digits.length >= 10 ? undefined : 'Enter a valid mobile number.';
    }
    case 'notes':
      return undefined;
    default:
      return undefined;
  }
}

export function validateClientIntakeForm(draft: ClientIntakeDraft) {
  return {
    fullName: validateClientIntakeField(draft, 'fullName'),
    email: validateClientIntakeField(draft, 'email'),
    phone: validateClientIntakeField(draft, 'phone'),
  } satisfies ClientIntakeErrors;
}

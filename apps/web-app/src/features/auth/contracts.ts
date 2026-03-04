export interface OwnerAuthSession {
  status: 'authenticated' | 'anonymous';
  ownerId: string | null;
  businessId: string | null;
}

export interface OwnerAuthRepository {
  getSession(): OwnerAuthSession;
}

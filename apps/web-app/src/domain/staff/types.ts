export type StaffStatus = 'Active' | 'Invite pending';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  badge: string;
  services: string[];
  schedule: string;
  status: StaffStatus;
}

export type TeamMemberRecord = StaffMember;
export type BookingStaffMember = StaffMember;

export type BookingStatus =
  | "PENDING_APPROVAL"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  accessToken?: string;
  isNewUser?: boolean;
  user?: Owner;
  auth?: Owner;
}
export interface Owner {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  contactNumber?: string;
  businessName?: string;
  accessToken?: string;
  [key: string]: unknown;
}
export interface Booking {
  id: string;
  displayId?: string;
  userName?: string;
  userPhone?: string;
  status?: BookingStatus;
  bookingStatus?: BookingStatus;
  bookingDate?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  amount?: number;
  totalAmount?: number;
  paymentStatus?: string;
  paymentMethod?: string;
  turf?: { name?: string };
  turfName?: string;
  sport?: string;
  slot?: { startTime: string; endTime: string };
  [key: string]: unknown;
}
export interface DashboardData {
  ownerName?: string;
  totalRevenue?: number;
  todayRevenue?: number;
  pendingApprovals?: number;
  totalBookings?: number;
  recentBookings?: Booking[];
  [key: string]: unknown;
}
export interface Turf {
  id: string;
  name: string;
  location?: string;
  address?: string;
  sport?: string;
  sports?: string[];
  pricePerHour?: number;
  status?: string;
  images?: Record<string, string> | string[];
  video?: string;
  [key: string]: unknown;
}
export interface SettlementSummary {
  totalRevenue?: number;
  totalSettled?: number;
  pendingSettlement?: number;
  bankName?: string;
  accountNumber?: string;
  [key: string]: unknown;
}
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  time?: string;
  isRead?: boolean;
  bookingId?: string;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const API_TIMEOUT_MS = Number(
  process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 30000,
);
export const TOKEN_KEY =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE ?? "turfzy_owner_token";
export const USER_KEY =
  process.env.NEXT_PUBLIC_AUTH_USER_STORAGE_KEY ?? "turfzy_owner_user";
export const SPORT_OPTIONS = [
  "Football",
  "Cricket",
  "Basketball",
  "Badminton",
  "Tennis",
  "Volleyball",
  "Other",
];
export const AMENITIES = [
  "Parking",
  "Washroom",
  "Drinking Water",
  "Changing Room",
  "Floodlights",
  "Equipment Rental",
  "Cafeteria",
  "First Aid",
];
export const MANUAL_REASONS = [
  "Scanner Not Working",
  "Camera Issue",
  "Technical Issue",
  "Other",
];
export const SUPPORT_CATEGORIES = [
  "Booking Issue",
  "Payment Query",
  "App Feedback",
  "Other",
];

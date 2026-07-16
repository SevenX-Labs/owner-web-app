import { format, formatDistanceToNow } from "date-fns";
export const currency = (value?: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
export const dateLabel = (value?: string) => {
  try {
    return value ? format(new Date(value), "dd MMM yyyy") : "—";
  } catch {
    return "—";
  }
};
export const timeLabel = (value?: string) => {
  if (!value) return "—";
  if (/^\d{2}:\d{2}/.test(value)) {
    const [h, m] = value.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  }
  try {
    return format(new Date(value), "h:mm a");
  } catch {
    return value;
  }
};
export const relativeTime = (value?: string) => {
  try {
    return value
      ? formatDistanceToNow(new Date(value), { addSuffix: true })
      : "";
  } catch {
    return "";
  }
};
export const statusLabel = (status?: string) =>
  (status || "pending")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

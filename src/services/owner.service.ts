import { api, responseData } from "@/lib/api";
import type {
  ApiEnvelope,
  Booking,
  DashboardData,
  SettlementSummary,
  Turf,
} from "@/types";
export const ownerService = {
  dashboard: () =>
    api
      .get<ApiEnvelope<DashboardData>>("/owner-home/dashboard")
      .then(responseData),
  bookings: () =>
    api
      .get<ApiEnvelope<Booking[]>>("/booking/owner/bookings")
      .then(responseData),
  booking: (id: string) =>
    api
      .get<ApiEnvelope<Booking>>(`/booking/owner/bookings/${id}`)
      .then(responseData),
  approve: (id: string) =>
    api
      .post<ApiEnvelope<Booking>>(`/booking/owner/bookings/${id}/approve`)
      .then(responseData),
  reject: (id: string) =>
    api
      .post<ApiEnvelope<Booking>>(`/booking/owner/bookings/${id}/reject`)
      .then(responseData),
  manualCheckIn: (id: string, reason: string) =>
    api
      .post<ApiEnvelope<unknown>>(`/booking/${id}/manual-checkin`, { reason })
      .then(responseData),
  verifyQr: (qrData: string) =>
    api
      .post<ApiEnvelope<unknown>>("/booking/verify-qr", { qrData })
      .then(responseData),
  analytics: () =>
    Promise.all([
      api.get("/owner-analytics/overall"),
      api.get("/owner-analytics/revenue-by-date"),
      api.get("/owner-analytics/peak-hours"),
    ]).then(([overall, revenue, peak]) => ({
      overall: overall.data,
      revenue: revenue.data,
      peak: peak.data,
    })),
  settlements: () =>
    Promise.all([
      api.get<ApiEnvelope<SettlementSummary>>("/owner-settlements/summary"),
      api.get("/owner-settlements/history"),
    ]).then(([summary, history]) => ({
      summary: summary.data,
      history: history.data,
    })),
  profile: () => api.get("/ownerProfile").then(responseData),
  updateProfile: (payload: Record<string, unknown>) =>
    api.patch("/ownerProfile", payload).then(responseData),
  payout: (payload: Record<string, unknown>) =>
    api.patch("/owner-settings/payout", payload).then(responseData),
  turfs: () => api.get<ApiEnvelope<Turf[]>>("/turfs/my").then(responseData),
  createTurf: (payload: Record<string, unknown>) =>
    api.post<ApiEnvelope<Turf>>("/turfs", payload).then(responseData),
  updateTurf: (id: string, payload: Record<string, unknown>) =>
    api.patch<ApiEnvelope<Turf>>(`/turfs/${id}`, payload).then(responseData),
  uploadImage: (id: string, type: string, file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api
      .post(`/turfs/${id}/upload-image/${type}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(responseData);
  },
  uploadVideo: (id: string, file: File) => {
    const form = new FormData();
    form.append("video", file);
    return api
      .post(`/turfs/${id}/video`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(responseData);
  },
  registerNotification: (token: string, platform: "android" | "ios") =>
    api
      .post("/notifications/register-token", { token, platform })
      .then(responseData),
};

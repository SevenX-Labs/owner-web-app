import { api, responseData } from "@/lib/api";
import type { ApiEnvelope, Owner } from "@/types";
export const authService = {
  login: (phone: string) =>
    api
      .post<ApiEnvelope<unknown>>("/auth/owner/login", { phone })
      .then(responseData),
  resendOtp: (phone: string) =>
    api
      .post<ApiEnvelope<unknown>>("/auth/owner/resend-otp", { phone })
      .then(responseData),
  verifyOtp: (phone: string, otp: string) =>
    api
      .post<ApiEnvelope<unknown>>("/auth/owner/verify-otp", { phone, otp })
      .then(responseData),
  getMe: () => api.get<ApiEnvelope<Owner>>("/auth/get-me").then(responseData),
  logout: () =>
    api.get<ApiEnvelope<unknown>>("/auth/logout").then(responseData),
};

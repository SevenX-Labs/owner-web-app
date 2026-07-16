"use client";
import Cookies from "js-cookie";
import { TOKEN_KEY, USER_KEY } from "@/constants";
import type { Owner } from "@/types";
export const session = {
  getToken: () => Cookies.get(TOKEN_KEY) || null,
  set(token: string, user: Owner) {
    Cookies.set(TOKEN_KEY, token, {
      sameSite: "lax",
      secure: location.protocol === "https:",
      expires: 7,
    });
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser: (): Owner | null => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as Owner) : null;
    } catch {
      return null;
    }
  },
  clear() {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

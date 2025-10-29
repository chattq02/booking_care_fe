import { COOKIE_KEYS } from "@/constants";
import Cookies from "js-cookie";

interface TokenParams {
  at: string;
  rt: string;
  atMaxAge?: number;
  rtMaxAge?: number;
}

export async function saveTokens({ at, rt, atMaxAge, rtMaxAge }: TokenParams) {
  const atExpires = atMaxAge ? atMaxAge / (1000 * 60 * 60 * 24) : undefined;
  const rtExpires = rtMaxAge ? rtMaxAge / (1000 * 60 * 60 * 24) : undefined;
  Cookies.set(COOKIE_KEYS.at, at, {
    httpOnly: false,
    secure: true,
    expires: atExpires,
    path: "/",
    sameSite: "Lax",
  });
  Cookies.set(COOKIE_KEYS.rt, rt, {
    httpOnly: false,
    secure: true,
    expires: rtExpires,
    path: "/",
    sameSite: "Lax",
  });
}

export async function clearTokens() {
  // cookies().delete(COOKIE_KEYS.at);
  // cookies().delete(COOKIE_KEYS.rf);
  // cookies().delete(COOKIE_KEYS.lng);
  // cookies().delete(COOKIE_KEYS.is_admin);
  // cookies().delete(COOKIE_KEYS.position);
}

export async function logout() {
  await clearTokens();
}

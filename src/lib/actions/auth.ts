import { COOKIE_KEYS } from "@/constants";
import Cookies from "js-cookie";

interface TokenParams {
  at: string;
  atbMaxAge?: number;
}

export async function saveCookies({ at, atbMaxAge }: TokenParams) {
  const atExpires = atbMaxAge ? atbMaxAge / (1000 * 60 * 60 * 24) : undefined;

  Cookies.set(COOKIE_KEYS.at, at, {
    httpOnly: false,
    secure: true,
    expires: atExpires,
    path: "/",
    sameSite: "Lax",
  });
}

export async function clearTokens() {
  Cookies.remove(COOKIE_KEYS.at);
}

export async function logout() {
  await clearTokens();
}

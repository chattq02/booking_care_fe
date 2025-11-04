import { getProfile } from "@/pages/auth/hooks/useAuth";
import type { GetMeResponseData } from "@/types/auth";
import { atom } from "jotai";

export const userAtom = atom<GetMeResponseData | null>(null);

let accessTokenCache: string | null = null;

export const accessTokenStore = {
  set(token: string | null) {
    accessTokenCache = token;
  },
  get() {
    return accessTokenCache;
  },
  remove() {
    accessTokenCache = null;
  },
};


export const fetchUserAtom = atom(
  null,
  async (_get, set) => {
    const result = await getProfile();
    set(userAtom, result ?? null);
  }
);
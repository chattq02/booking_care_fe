import type { GetMeResponseData } from "@/types/auth";
import { atom } from "jotai";

export const userAtom = atom<GetMeResponseData | null>(null);

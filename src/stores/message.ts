import { atom } from "jotai";
import type { MessageInstance } from "antd/es/message/interface";

interface MessageState {
  messageApi: MessageInstance | null;
  contextHolder: React.ReactNode | null;
}

export const messageAtom = atom<MessageState>({
  messageApi: null,
  contextHolder: null,
});

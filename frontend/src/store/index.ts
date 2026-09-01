import { create } from 'zustand';
import type { User, Meeting, Message } from '../types';

interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

interface MeetingStore {
  currentMeeting: Meeting | null;
  participants: any[];
  messages: Message[];
  setCurrentMeeting: (meeting: Meeting | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));

export const useMeetingStore = create<MeetingStore>((set) => ({
  currentMeeting: null,
  participants: [],
  messages: [],
  setCurrentMeeting: (meeting) => set({ currentMeeting: meeting }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setMessages: (messages) => set({ messages }),
}));

import axios, { AxiosInstance } from 'axios';
import { authService } from '../lib/authService';
import type { ApiResponse, Meeting, Participant, Message, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Firebase ID token to requests
client.interceptors.request.use(async (config) => {
  try {
    const user = authService.getCurrentUser();
    if (user) {
      const token = await authService.getIdToken(user);
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Failed to get ID token:', error);
  }
  return config;
});

// Handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Meetings API
export const meetingsAPI = {
  create: (title: string, description?: string) =>
    client.post<ApiResponse<Meeting>>('/meetings', { title, description }),

  list: () =>
    client.get<ApiResponse<Meeting[]>>('/meetings'),

  get: (meetingId: string) =>
    client.get<ApiResponse<Meeting>>(`/meetings/${meetingId}`),

  join: (meetingId: string) =>
    client.post<ApiResponse<Participant>>(`/meetings/${meetingId}/join`, {}),

  leave: (meetingId: string) =>
    client.post<ApiResponse<void>>(`/meetings/${meetingId}/leave`, {}),

  end: (meetingId: string) =>
    client.post<ApiResponse<void>>(`/meetings/${meetingId}/end`, {}),

  getParticipants: (meetingId: string) =>
    client.get<ApiResponse<Participant[]>>(`/meetings/${meetingId}/participants`),
};

// Messages API
export const messagesAPI = {
  getMessages: (meetingId: string) =>
    client.get<ApiResponse<Message[]>>(`/meetings/${meetingId}/messages`),

  sendMessage: (meetingId: string, content: string) =>
    client.post<ApiResponse<Message>>(`/meetings/${meetingId}/messages`, {
      content,
    }),
};

// Participants API
export const participantsAPI = {
  mute: (participantId: string) =>
    client.post<ApiResponse<void>>(`/participants/${participantId}/mute`, {}),

  unmute: (participantId: string) =>
    client.post<ApiResponse<void>>(`/participants/${participantId}/unmute`, {}),

  toggleCamera: (participantId: string, enabled: boolean) =>
    client.post<ApiResponse<void>>(`/participants/${participantId}/camera`, {
      enabled,
    }),

  toggleScreenShare: (participantId: string, enabled: boolean) =>
    client.post<ApiResponse<void>>(`/participants/${participantId}/screen-share`, {
      enabled,
    }),
};

export default client;

import axios from 'axios';
import type { ApiResponse, Meeting, Participant, Message, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email: string, name: string, password: string) =>
    client.post<ApiResponse<{ token: string; user: User }>>('/auth/register', {
      email,
      name,
      password,
    }),

  login: (email: string, password: string) =>
    client.post<ApiResponse<{ token: string; user: User }>>('/auth/login', {
      email,
      password,
    }),

  getMe: () =>
    client.get<ApiResponse<User>>('/auth/me'),
};

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

import { io } from 'socket.io-client';

// Use production backend URL if available, otherwise local
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const socket = io(BACKEND_URL, {
  reconnectionAttempts: 5,
});

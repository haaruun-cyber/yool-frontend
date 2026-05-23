import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '../store/authStore';

const socketUrl = () =>
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  (typeof window !== 'undefined' ? window.location.origin : '');

export function useCollaborationSocket() {
  const socketRef = useRef(null);
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!token) return undefined;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${socketUrl()}/hubs/collaboration`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.start().catch(() => {});
    socketRef.current = {
      connection,
      emit(event, ...args) {
        const methods = {
          'join-document': 'JoinDocument',
          'leave-document': 'LeaveDocument',
          'document-change': 'SendChange',
          'cursor-update': 'SendCursor',
        };
        return connection.invoke(methods[event] || event, ...args);
      },
      on(event, handler) {
        connection.on(event, handler);
      },
      off(event, handler) {
        connection.off(event, handler);
      },
      disconnect() {
        return connection.stop();
      },
    };

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return socketRef;
}

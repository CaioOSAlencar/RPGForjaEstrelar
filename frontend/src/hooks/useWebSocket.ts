import { useState } from 'react';

interface UseWebSocketProps {
  campaignId?: string;
  sceneId?: string;
}

export const useWebSocket = ({ campaignId, sceneId }: UseWebSocketProps = {}) => {
  const [isConnected] = useState(false); // Sempre offline por enquanto

  const emit = (event: string, data?: any) => {
    console.log('WebSocket emit (mock):', event, data);
  };

  const on = (event: string, callback: (data: any) => void) => {
    console.log('WebSocket on (mock):', event);
    return () => {};
  };

  const off = (event: string, callback?: (data: any) => void) => {
    console.log('WebSocket off (mock):', event);
  };

  return {
    isConnected,
    emit,
    on,
    off,
    socket: null
  };
};
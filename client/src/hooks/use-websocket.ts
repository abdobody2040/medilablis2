import { useEffect, useRef, useState } from 'react';
import { useSamplesStore } from '@/store/samples-store';
import { useUIStore } from '@/store/ui-store';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const { addSample, updateSample } = useSamplesStore();
  const { addNotification } = useUIStore();

  useEffect(() => {
    const connectWebSocket = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      try {
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
          setIsConnected(true);
          console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            switch (message.type) {
              case 'sample_created':
                addSample(message.data);
                addNotification({
                  type: 'info',
                  title: 'New Sample',
                  message: `Sample ${message.data.sampleId} has been created`,
                });
                break;
                
              case 'sample_updated':
                updateSample(message.data.id, message.data);
                addNotification({
                  type: 'info',
                  title: 'Sample Updated',
                  message: `Sample ${message.data.sampleId} has been updated`,
                });
                break;
                
              case 'patient_registered':
                addNotification({
                  type: 'success',
                  title: 'New Patient',
                  message: `${message.data.firstName} ${message.data.lastName} has been registered`,
                });
                break;
                
              default:
                console.log('Unknown message type:', message.type);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.current.onclose = (event) => {
          setIsConnected(false);
          console.log('WebSocket disconnected', event.code, event.reason);
          
          // Attempt to reconnect after 3 seconds if not a normal closure
          if (event.code !== 1000) {
            setTimeout(connectWebSocket, 3000);
          }
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        setIsConnected(false);
        // Retry connection after 5 seconds
        setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close(1000, 'Component unmounting');
      }
    };
  }, [addSample, updateSample, addNotification]);

  const sendMessage = (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return {
    isConnected,
    sendMessage,
  };
}

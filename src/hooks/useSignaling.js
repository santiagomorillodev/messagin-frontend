import { useEffect, useRef, useState } from "react";

export function useSignaling(userId, onMessage) {
  const ws = useRef(null);
  const isClosing = useRef(false);     // evita cierres dobles
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;
    isClosing.current = false;

    const socket = new WebSocket(`wss://messagin-backend.onrender.com/ws/signaling/${userId}`);
    ws.current = socket;

    socket.onopen = () => {
      setConnected(true);
      console.log("SIGNALING CONNECTED");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onerror = (err) => {
      console.error("SIGNALING ERROR:", err);
    };

    socket.onclose = () => {
      setConnected(false);
      if (!isClosing.current) {
        console.warn("Signaling socket closed unexpectedly");
      }
    };

    return () => {
      isClosing.current = true;
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [userId]);

  function send(data) {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.warn("SIGNALING: socket not open yet, message ignored");
    }
  }

  return { send, connected };
}

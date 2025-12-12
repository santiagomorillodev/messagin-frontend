import { createContext, useContext, useEffect, useRef, useState } from "react";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

const WebSocketContext = createContext(null);
export const useWebSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({ children }) {
  const { currentUser } = useGetCurrentUser();

  const socketRef = useRef(null);
  const reconnectTimer = useRef(null);

  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [unreadByConversation, setUnreadByConversation] = useState({});
  console.log(unreadByConversation)

  const [wsInstance, setWsInstance] = useState(null);


  const reloadUnread = async () => {
    if (!currentUser?.id) return;

    try {
      const res = await fetch("https://messagin-backend.onrender.com/conversation/unread", {
        credentials: "include",
      });

      const data = await res.json();

      // data = { conversation_id: unread_count, ... }
      setUnreadByConversation(data);
    } catch (e) {
      console.error("Error cargando unread:", e);
    }
  };

  // ========================================================
  // Limpiar un unread para una conversación
  // ========================================================
  const clearUnread = (conversationId) => {
    setUnreadByConversation((prev) => {
      const copy = { ...prev };
      delete copy[conversationId];
      return copy;
    });
  };

  // ========================================================
  // WEBSOCKET HANDLING
  // ========================================================
  const connectSocket = () => {
    if (!currentUser?.id) return;

    // Si ya existe, no vuelvas a abrir
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`wss://messagin-backend.onrender.com/ws/user/${currentUser.id}`);

    socketRef.current = ws;
    setWsInstance(ws);

    ws.onopen = () => {
      setConnected(true);
      reloadUnread();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };

    ws.onclose = () => {
      setConnected(false);
      attemptReconnect();
    };

    ws.onerror = () => {
      setConnected(false);
      ws.close();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "message") {
        // Lógica para actualizar mensajes en tiempo real (ya implementada)
        window.dispatchEvent(new CustomEvent("new-message", { detail: data }));
      }

      if (data.type === "notification") {
        // Lógica para notificaciones (puedes mostrar un toast)
        setNotifications((prev) => [...prev, data]);
        window.dispatchEvent(
          new CustomEvent("new-notification", { detail: data })
        );
      }

      if (data.type === "unread_update") {
        // El 'data.unread' es el mapa completo: { conversation_id: unread_count, ... }
        // Reemplazamos el mapa actual con el nuevo mapa de no leídos.
        setUnreadByConversation(data.unread); // <--- AQUI ESTÁ EL CAMBIO CLAVE

        // Opcionalmente, puedes usar la siguiente línea si quieres MERGEAR:
        // setUnreadByConversation(prev => ({ ...prev, ...data.unread }));

        console.log("Nuevo mapa de no leídos recibido:", data.unread); // Ahora se ejecutará

        window.dispatchEvent(new CustomEvent("new-unread", { detail: data }));
      }
    };
  };

  // Intentar reconectar solo 1 vez cada 2 segundos
  const attemptReconnect = () => {
    if (reconnectTimer.current) return; // evita múltiples timers
    reconnectTimer.current = setTimeout(() => {
      reconnectTimer.current = null;
      connectSocket();
    }, 2000);
  };

  // Abrir socket cuando currentUser cambie
  useEffect(() => {
    if (currentUser?.id) connectSocket();
    return () => socketRef.current?.close();
  }, [currentUser]);

  // ========================================================
  // API pública para enviar mensajes por WebSocket
  // ========================================================
  const send = (payload) => {
    if (wsInstance?.readyState === WebSocket.OPEN) {
      wsInstance.send(JSON.stringify(payload));
    }
  };

  const disconnectSocket = () => {
    console.log("Closing WebSocket...");

    // Cancelar reconexiones automáticas
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    // Cerrar conexión si existe
    if (socketRef.current) {
      try {
        socketRef.current.onclose = null;  // evita que intente reconectar
        socketRef.current.onerror = null;
        socketRef.current.onmessage = null;

        socketRef.current.close();
        console.log("WebSocket closed manually.");
      } catch (e) {
        console.error("Error closing WS:", e);
      }
  }

  setConnected(false);
  socketRef.current = null;
  setWsInstance(null);
};


  return (
    <WebSocketContext.Provider
      value={{
        socket: wsInstance,
        send,
        connected,
        notifications,
        unreadByConversation,
        setUnreadByConversation,
        reloadUnread,
        clearUnread,
        disconnectSocket
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

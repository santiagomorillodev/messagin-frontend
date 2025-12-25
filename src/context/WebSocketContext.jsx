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
  if (!currentUser?.id) {
    console.log('No hay current user id, esperando...'); // Cambiar de error a log
    return;
  }

  // Si ya existe y está abierto, no hacer nada
  if (socketRef.current?.readyState === WebSocket.OPEN) {
    console.log('WebSocket ya está abierto');
    return;
  }

  // Si está en estado de conexión o cerrando, no crear uno nuevo
  if (socketRef.current?.readyState === WebSocket.CONNECTING) {
    console.log('WebSocket ya está conectando...');
    return;
  }

  console.log('Conectando WebSocket para usuario:', currentUser.id);
  
  const ws = new WebSocket(`wss://messagin-backend.onrender.com/ws/user/${currentUser.id}`);

  socketRef.current = ws;
  setWsInstance(ws);

  ws.onopen = () => {
    console.log('WebSocket conectado exitosamente');
    setConnected(true);
    reloadUnread();
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    reconnectTimer.current = null;
  };

  ws.onclose = (event) => {
    console.log(`WebSocket cerrado. Código: ${event.code}, Razón: ${event.reason}`);
    setConnected(false);
    socketRef.current = null;
    setWsInstance(null);
    
    // Solo intentar reconectar si no fue un cierre intencional
    if (event.code !== 1000) { // 1000 = cierre normal
      attemptReconnect();
    }
  };

  ws.onerror = (error) => {
    console.error('Error en WebSocket:', error);
    setConnected(false);
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
  // En WebSocketProvider.jsx - modificar attemptReconnect
const attemptReconnect = () => {
  if (reconnectTimer.current) {
    clearTimeout(reconnectTimer.current);
    reconnectTimer.current = null;
  }
  
  console.log('Intentando reconectar en 3 segundos...');
  reconnectTimer.current = setTimeout(() => {
    if (currentUser?.id) {
      connectSocket();
    }
  }, 3000);
};

  // Abrir socket cuando currentUser cambie
  useEffect(() => {
  if (currentUser?.id) {
    console.log('Usuario disponible, conectando WebSocket');
    connectSocket();
  } else {
    console.log('Usuario no disponible, cerrando WebSocket si existe');
    if (socketRef.current) {
      disconnectSocket();
    }
  }
  
  return () => {
    // Limpiar timer al desmontar
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
  };
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

import { Outlet } from "react-router-dom";
import { WebSocketProvider } from "../context/WebSocketContext.jsx";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

export default function PrivateLayoutWithWebSocket() {
  const { currentUser } = useGetCurrentUser();
  if (!currentUser) return null;
  
  return (
    <WebSocketProvider>
      <Outlet />
    </WebSocketProvider>
  );
}
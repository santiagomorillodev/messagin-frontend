import { Outlet } from "react-router-dom";
import { CallProvider } from "../context/CallContext";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

export default function PrivateLayout() {
  const { currentUser } = useGetCurrentUser();

  if (!currentUser) return null;

  return (
    <CallProvider>
      <Outlet />
    </CallProvider>
  );
}

import { Outlet } from "react-router-dom";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

export default function PrivateLayout() {
  const { currentUser } = useGetCurrentUser();

  if (!currentUser) return null;

  return <Outlet />; // ← SIN providers extra, SOLO Outlet
}
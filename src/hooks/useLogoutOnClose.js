import { useEffect } from "react";

export default function useLogoutOnClose() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      navigator.sendBeacon("https://messagin-backend.onrender.com/logout");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
}
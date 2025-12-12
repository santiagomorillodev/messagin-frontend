import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

export default function NavSettings() {
  const { disconnectSocket } = useWebSocket();
  const navigate = useNavigate();
  const { setCurrentUserFunction } = useGetCurrentUser();

  const handleLogout = async () => {
    console.log("Logging out...");

    try {
      await fetch("https://messagin-backend.onrender.com/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Network logout error:", error);
    }

    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // CERRAR WS ANTES DE BORRAR USER
    disconnectSocket();

    setCurrentUserFunction(null);
    navigate("/");

    console.log("Logged out successfully");
  };

  return (
    <ul className="w-42 md:hidden fixed top-2 right-1 z-[99999]">
      <li className="relative group/dropdown">
        <label className="flex justify-end">
          <i className="bx bx-dots-vertical-rounded text-3xl cursor-pointer text-white"></i>
          <input type="checkbox" className="hidden" />
        </label>

        {/* Dropdown */}
        <ul
          className="
        absolute right-0 top-[calc(100%+11px)]
        opacity-0 pointer-events-none
        group-has-checked/dropdown:opacity-100
        group-has-checked/dropdown:pointer-events-auto

        bg-first 
        rounded-2xl w-full p-4 shadow-2xl flex flex-col gap-3
        transition-all duration-300

        z-[99999]
      "
        >
          <li
            className="flex items-center gap-2 cursor-pointer text-black dark:text-white"
            onClick={handleLogout}
          >
            <i className="bx bx-run"></i>
            <span>Log out</span>
          </li>

          <li
            className="flex items-center gap-2 cursor-pointer text-black dark:text-white"
            onClick={() => navigate("/profile/me")}
          >
            <i className="bx bx-street-view"></i>
            <span>Profile</span>
          </li>

          <li
            className="flex items-center gap-2 cursor-pointer text-black dark:text-white"
            onClick={() => navigate("/settings")}
          >
            <i className="bx bx-lock"></i>
            <span>Settings</span>
          </li>

          <li className="flex items-center gap-2 cursor-pointer text-black dark:text-white">
            <i className="bx bx-moon"></i>
            <span>Dark mode</span>
          </li>
        </ul>
      </li>
    </ul>
  );
}

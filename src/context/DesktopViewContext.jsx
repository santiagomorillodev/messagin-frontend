import { createContext, useContext, useState, useEffect } from "react";

const DesktopViewContext = createContext();

export const useDesktopView = () => useContext(DesktopViewContext);

export function DesktopViewProvider({ children }) {
  const [activeView, setActiveView] = useState("default");
  const [viewData, setViewData] = useState(null);

  const changeView = (view, data = null) => {
    setActiveView(view);
    setViewData(data);
  };

  const resetView = () => {
    setActiveView("default");
    setViewData(null);
  };

  // 🔹 Escuchar tecla ESC para volver al default
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        resetView();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <DesktopViewContext.Provider
      value={{ activeView, viewData, changeView, resetView }}
    >
      {children}
    </DesktopViewContext.Provider>
  );
}

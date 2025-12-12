import { useCallback, useRef } from "react";

export const useChatSummaryMenu = ({ setMenu, setVisibility, setIsDelete }) => {
  const holdTimer = useRef(null);
  const isHolding = useRef(false);

  // --- CLICK DERECHO ---
  const toggleMenu = useCallback(
    (e) => {
      e.preventDefault();
      setMenu((prev) => !prev);
      setVisibility((prev) => !prev);
    },
    [setMenu, setVisibility]
  );

  const startHold = useCallback(() => {
    isHolding.current = true;

    holdTimer.current = setTimeout(() => {
      if (isHolding.current) {
        setMenu(true);
        setVisibility(false);
      }
    }, 1000);
  }, [setMenu, setVisibility]);

  const cancelHold = useCallback(() => {
    isHolding.current = false;
    if (holdTimer.current) clearTimeout(holdTimer.current);
  }, []);

  const deleteConversation = useCallback(
    async (idUser) => {
      const response = await fetch(
        `https://messagin-backend.onrender.com/conversation/api/delete`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: idUser }),
        }
      );

      if (response.ok) {
        setVisibility(false);
        setIsDelete(true);
      } else {
        console.log("Error deleting conversation");
      }
    },
    [setVisibility, setIsDelete]
  );

  return {
    toggleMenu,
    startHold,
    cancelHold,
    deleteConversation,
  };
};

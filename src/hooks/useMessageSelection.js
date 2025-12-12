import { useRef, useState } from "react";

export default function useMessageSelection(id, setListDelete) {
  const [menu, setMenu] = useState(false);
  const pressTimer = useRef(null);

  const toggleSelection = () => {
    setMenu((prev) => !prev);

    setListDelete((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      return [...prev, id];
    });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    clearTimeout(pressTimer.current);
    toggleSelection();
  };

  const handleMouseDown = () => {
    pressTimer.current = setTimeout(() => {
      toggleSelection();
    }, 1000); // long press
  };

  const clearPress = () => {
    clearTimeout(pressTimer.current);
  };

  return {
    menu,
    handleContextMenu,
    handleMouseDown,
    handleMouseUp: clearPress,
    handleMouseLeave: clearPress,
  };
}

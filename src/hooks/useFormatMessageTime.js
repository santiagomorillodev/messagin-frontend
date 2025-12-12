import { useState, useEffect } from "react";

export function useFormatMessageTime(dateString) {
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!dateString) {
      setTime("");
      return;
    }

    const date = new Date(dateString);
    const now = new Date();

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.floor((nowOnly - dateOnly) / (1000 * 60 * 60 * 24));

    let formatted;
    if (diffDays === 0) {
      formatted = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffDays === 1) {
      formatted = "Yesterday";
    } else {
      formatted = capitalize(
        date.toLocaleDateString("en-US", { weekday: "long" })
      );
    }

    setTime(formatted);
  }, [dateString]); // ✅ actualiza cuando cambia el mensaje
  return time;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

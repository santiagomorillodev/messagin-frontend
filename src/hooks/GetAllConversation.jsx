import { useEffect, useState } from 'react'

export default function GetAllConversation() {
  const [conversations, setConversations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getConversations() {
      try {
        const response = await fetch("https://messagin-backend.onrender.com/conversation/all", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setConversations(data);
          setIsLoading(false);
        } else {
          console.error("Failed to fetch conversations:", response.status);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    }

    getConversations();
  }, []);

  return { conversations };
}

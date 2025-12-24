import { useEffect, useState, useCallback } from "react";

export default function useGetLastMessage(conversationId) {
  const [lastMessage, setLastMessage] = useState(null);
  const [countUnreadMessages, setCountUnreadMessages] = useState(0)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const reload = useCallback(() => setReloadFlag(f => f + 1), []);

  useEffect(() => {
    if (conversationId == null) {
      setLastMessage(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let mounted = true;

    async function fetchLastMessage() {
      setLoading(true);
      setError(null);
      console.log('entrando al componente')
      try {
        const res = await fetch(`https://messagin-backend.onrender.com/conversation/${conversationId}/last-message`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        

        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const data = await res.json();
        const message = data?.['last_message'] ?? data;
        const countMessages = data?.['count_unread_messages']
        if (mounted) {
          setLastMessage(message ?? null)
          setCountUnreadMessages(countMessages)
        };
      } catch (err) {
        if (err.name === "AbortError") {
        } else {
          if (mounted) {
            console.error("Error fetching last message:", err);
            setError(err);
            setLastMessage(null);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchLastMessage();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [conversationId, reloadFlag]);


  return { lastMessage,countUnreadMessages, loading, error, reload };
}
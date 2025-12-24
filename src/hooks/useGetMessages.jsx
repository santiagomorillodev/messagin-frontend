import { useEffect, useState } from 'react'

export default function useGetMessages({conversationId}) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      console.log('🔄 useGetMessages ejecutándose con conversationId:', conversationId);
      
      // Si no hay conversationId, no hacer fetch
      if (!conversationId) {
        console.log('❌ conversationId es undefined/vacío, abortando fetch');
        setLoading(false);
        return;
      }
      
      async function fetchMessages() {
        try {
          console.log('📡 Haciendo fetch a:', `https://messagin-backend.onrender.com/inbox/chat/${conversationId}`);
          
          const res = await fetch(`https://messagin-backend.onrender.com/inbox/chat/${conversationId}`, {
            method: "GET",
            credentials: "include",
          });
          
          console.log('📊 Response status:', res.status);
          
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const data = await res.json();
          console.log('✅ Mensajes recibidos:', data);
          setMessages(data);
        } catch (error) {
          console.error("❌ Error fetching messages:", error);
        } finally {
          setLoading(false);
        }
      }
      
      // ✅ ESTO ES LO CORRECTO: Ejecutar la función directamente
      fetchMessages();
      
    }, [conversationId]) // Se ejecutará cada vez que conversationId cambie

    return {messages, loading, error: !loading && messages.length === 0};
}
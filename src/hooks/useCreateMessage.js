import { useState } from "react";

export default function useCreateMessage() {
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const createMessage = async ({ conversation_id, content, file }) => {
    try {
      setLoadingMessage(true);
      setErrorMessage(null);

      const formData = new FormData();
      formData.append("conversation_id", conversation_id);
      if (content) formData.append("content", content);
      if (file) formData.append("file", file);

      const response = await fetch("https://messagin-backend.onrender.com/inbox/api/create/message", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error creando Message: ${errText}`);
      }

      const data = await response.json();
      return data; // ✅ devolvemos el mensaje creado
    } catch (error) {
      setErrorMessage(error.message);
      console.error("⚠️ Error en createMessage:", error);
      throw error;
    } finally {
      setLoadingMessage(false);
    }
  };

  return { createMessage, loadingMessage, errorMessage };
}

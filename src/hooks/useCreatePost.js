import { useState } from "react";

export default function useCreatePost() {
  const [loadingPost, setLoadingPost] = useState(false);
  const [errorPost, setErrorPost] = useState(null);

  const createPost = async ({ content, file }) => {
    try {
      setLoadingPost(true);
      setErrorPost(null);

      const formData = new FormData();
      formData.append("content", content);
      if (file) formData.append("file", file);

      const response = await fetch("https://messagin-backend.onrender.com/post/create", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error creando post: ${errText}`);
      }

      const data = await response.json();
      return data; // post creado
    } catch (error) {
      setErrorPost(error.message);
      console.error(error);
    } finally {
      setLoadingPost(false);
    }
  };

  return { createPost, loadingPost, errorPost };
}

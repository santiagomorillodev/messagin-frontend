import { useEffect, useState, useCallback } from "react";

export default function useGetPosts({ id }) {
  const [posts, setPosts] = useState([]);

  const fetchPostsUser = useCallback(async () => {
    if (!id) return;
    const response = await fetch(`https://messagin-backend.onrender.com/post/${id}`);

    if (response.ok) {
      const data = await response.json();
      setPosts(data);
    } else {
      console.error("Failed to fetch posts");
    }
  }, [id]);

  useEffect(() => {
    fetchPostsUser();
  }, [fetchPostsUser]);

  return { posts, refetch: fetchPostsUser };
}

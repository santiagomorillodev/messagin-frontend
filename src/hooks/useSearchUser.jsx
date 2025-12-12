import { useEffect, useState } from "react";
export default function useSearchUser() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query || query.trim() === "") {
      setUser(null);
      setLoading(false)
      return;
    }
    async function getUserByUsername() {
      setLoading(true)
      try {
        const response = await fetch(
          `https://messagin-backend.onrender.com/search/username/${query}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const userData = await response.json();
          setUser({
            avatar_url: userData.avatar_url,
            id: userData.id,
            name: userData.name,
            username: userData.username,
          });
          console.log("User data:", userData);
        } else {
          setUser(null);
          console.warn(`Search response not ok ${response.status}`)
        }
      } catch (error) {
        console.error("Error fetching user by username:", error);
      } finally {
        setLoading(false)
      }
    }
    getUserByUsername();
    console.log("Searching for user with username:", query);
  }, [query]);

  return { user, query, setQuery, loading };
}

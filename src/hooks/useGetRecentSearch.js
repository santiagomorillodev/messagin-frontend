import { useEffect, useState } from 'react'

export default function useGetRecentSearch() {
  const [recentSearch, setRecentSearch] = useState([]);

  useEffect(() => {
    async function fetchRecentSearch() {
      try {
        const response = await fetch('https://messagin-backend.onrender.com/recent/search', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setRecentSearch(data);
      } catch (error) {
        console.error('Error fetching recent search:', error);
      }
    }

    fetchRecentSearch();
  }, []);

  return { recentSearch, setRecentSearch }; // 👈 añadimos setRecentSearch
}

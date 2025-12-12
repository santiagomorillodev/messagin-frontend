import React, { useEffect, useState } from 'react'
import useGetCurrentUser from './useGetCurrentUser';

export default function useGetAllPosts() {
  const [allPosts, setAllPosts] = useState([]);
  useEffect(() => {
      const fetchAllPosts = async () => {
          const response = await fetch(`https://messagin-backend.onrender.com/post/all`,{
              method: 'GET',
              credentials: 'include'
          });
          if (response.ok){
              const data = await response.json();
              setAllPosts(data);
          } else {
              console.error('Failed to fetch allPosts');
          }
      };
      fetchAllPosts();
  }, []);
    return {allPosts};
}

import React, { useEffect, useState } from 'react'

export default function useGetUser(idUser) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      async function getUser() {
        try{
          const data = await fetch(`https://messagin-backend.onrender.com/id/${idUser}`, {
            method: "GET",
            credentials: "include",
          });
          if (data.ok) {
            const response = await data.json();
            setUser(response);
          } else {
            console.error("Failed to fetch user data:", data.status);
          }
        }
        catch (error){
          console.error("Error fetching user data:", error);
        }
        finally{
          setLoading(false)
        }
      }
  
      getUser();
  
      return () => {
        setUser(null);
      }

    }, [idUser])
  return {user, loading, error: !loading && !user}
}

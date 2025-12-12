import { useEffect, useState } from 'react'

export default function useGetNotifications() {
  const [notifications, setNotifications] = useState([])
  useEffect(() => {
    async function get_notifications() {
      const response = await fetch('https://messagin-backend.onrender.com/notifications', {
        method: 'GET',
        credentials: 'include'
      })
      if (response.status === 401) {
        navigate('/login')
      }
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      } else {
        console.error('Failed to fetch notifications')
      }
    }
  
    get_notifications()
    
  }, [])
  return {notifications};
}

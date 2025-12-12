import { useState } from 'react'
import { Profile } from '../../pages/Profile'

export default function ProfileDesktop({ photo }) {
    const [showModalProfile, setShowModalProfile] = useState(false)
  return (
    <>
        <button onClick={() => setShowModalProfile(true)}><img 
            src={photo} 
            alt="user photo" 
            width='40' 
            className='rounded-full h-[40px] object-cover' 
        /></button>

        {showModalProfile && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-10" onClick={() => setShowModalProfile(false)}>
            <Profile />
          </div>
        )}
    </>
  )
}

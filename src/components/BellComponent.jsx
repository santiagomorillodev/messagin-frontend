import { useState } from "react";

export const BellComponent = ({content, photo, username, id}) => {
  const [isDelete, setIsDelete] = useState(false)
  async function handleButton() {
    const response = await fetch(`https://messagin-backend.onrender.com/api/notification/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Notification deleted:', data);
      setIsDelete(true);
    } else {
      console.error('Error deleting notification');
    }
  }
  console.log(id)
  return (
    <div className={`flex justify-between items-center px-4 text-white ${isDelete ? 'hidden' : ''}`}>
        <div className="flex gap-3">
            <img src={photo} alt="" width='50px' className='rounded-full min-w-[50px] h-[50px] object-cover'/>
            <div className="">
                <p>{username}</p>
                <p className="text-neutral-500 text-sm">{content}</p>
            </div>
        </div>
        <button className='py-2 px-4 bg-red-500 rounded-3xl font-semibold' onClick={handleButton}>Suprimir</button>
    </div>
  )
}

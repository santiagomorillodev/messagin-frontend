import { useEffect, useState } from "react";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

export function Posts({ id, userId, name, avatar, postText, postImage, likes }) {
  const { currentUser, loading, error } = useGetCurrentUser();
  const [liked, setLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(likes?.length || 0);
  const [menu, setMenu] = useState(false);
  const [visibility, setVisibility] = useState(true)

  useEffect(() => {
    if (!Array.isArray(likes) || !currentUser) return;
    const alreadyLiked = likes.some(like => like.user_id === currentUser.id);
    setLiked(alreadyLiked);
  }, [currentUser, likes]);

  async function handleClick() {
    await fetch("https://messagin-backend.onrender.com/api/like", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: id }),
    });

    setLiked(prev => !prev);
    setNumLikes(prev => prev + (liked ? -1 : 1));
  }

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center text-white">
      Loading profile...
    </div>
  );

  if (error) return (
    <div className="w-full h-screen flex items-center justify-center text-red-400">
      Error loading user.
    </div>
  );

  const handleMenu = (e) => {
    e.preventDefault();
    setMenu(!menu)
    console.log(menu)
  };

  const handleDelete = async () => {
    console.log('Deleting post', id);
    const response = await fetch(`https://messagin-backend.onrender.com/post/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      setVisibility(false);
      console.log('Post deleted successfully');
      return;
    }
    if (!response.ok) {
      console.log('Error deleting post')
    }
    
  };

  return (
    <div className={`w-full max-w-[498px] overflow-hidden border border-gray-400 rounded-2xl bg-first relative ${visibility ? '' : 'hidden'}`} onContextMenu={handleMenu} >
      <div className="flex items-center justify-between py-3 px-2 w-full">
        <div className="flex gap-2">
          <div className="w-12 h-12 overflow-hidden">
            <img src={avatar} alt={`${name} avatar`} className="rounded-full w-12 h-12 object-cover border-2 border-blue-500" loading="lazy"/>
          </div>
          <div>
            <p className="font-bold text-sm text-white">{name}</p>
            <p className="text-sm text-white">today</p>
          </div>
        </div>
        {menu && (
        <div className=" text-white flex items-center  gap-2 z-10 cursor-pointer" onClick={handleDelete}>
          <i className='bx bxs-trash text-red-500 text-3xl'></i>

        </div>)}
      </div>

      {postImage && (
        <div className="w-full h-[498px]">
          <img src={postImage} alt={`${name} post image`} className="w-full h-full object-cover" loading="lazy"/>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center">
          <button onClick={handleClick} className={`${liked ? "scale-125" : "scale-100"} transition-transform duration-200`}>
            <i className={`bx ${liked ? "bxs-heart text-red-500" : "bx-heart text-white"} text-3xl`} />
          </button>
          <span className="text-lg mb-1 text-white">{numLikes}</span>
        </div>
        <p className="text-[15px] max-w-[70%] text-white">{postText}</p>
      </div>

      
    </div>

  );
}

import photo3 from "../assets/photo3.jpg";
import { NavigationBar } from "../components/NavigationBar";
import { Posts } from "../components/Posts";
import { useNavigate } from "react-router-dom";
import useGetPosts from "../hooks/useGetPosts";
import useGetUser from "../hooks/useGetUser";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function ProfileOtherUser() {
  const location = useLocation();
  const otherUserId = location.state?.id || null;
  const { user, loading, error } = useGetUser(otherUserId);
  const { posts } = useGetPosts({ id: user ? user.id : null });
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);
  const [countFollowing, setCountFollowing] = useState(0);

  useEffect(() => {
    if (user) {
      setFollowing(user.following);
      setCountFollowing(user.follows);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-400">
        Error loading user.
      </div>
    );
  }

  const id = user.id;
  const name = user.name;
  const status = user.status;
  const photo = user.avatar_url;

  const handleClick = async () => {
    const response = await fetch(
      `https://messagin-backend.onrender.com/conversation/create/user/${id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (!response.ok) {
      console.error("Failed to create or get conversation");
      return;
    }
    const data = await response.json();
    const chatId = data.id;

    navigate("/direct", { state: { id, name, photo, chatId, status } });
  };

  const handleChangeFollowing = async () => {
    const response = await fetch(`https://messagin-backend.onrender.com/api/follow/${id}`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      console.error(response.statusText);
      return;
    }
    const data = await response.json()

    setFollowing(data.following);
    setCountFollowing(data.follows);


  };

  return (
    <section className="w-full bg-neutral-800 scroll-hidden">
      <section>
        <div
          className="w-full h-40 bg-first relative bg-cover bg-center"
          style={{ backgroundImage: `url(${photo3})` }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          <img
            src={user.avatar_url}
            alt={`${user.name} avatar`}
            className="rounded-full w-30 h-30 object-cover absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 border-4 border-blue-500"
          />
        </div>
      </section>

      <div className="w-full md:w-xl h-full md:h-[90vh] px-4 flex flex-col gap-5 mt-20 text-white">
        <div className="flex justify-between">
          <div>
            <p className="text-xl w-full ml-3 font-bold">{user["name"]}</p>
            <p className="text-[12px] ml-3">
              <span>{countFollowing}</span> Followers
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className={`${
                following ? "bg-red-500" : "bg-blue-500"
              } p-2 rounded-xl cursor-pointer`}
              onClick={handleChangeFollowing}
            >
              {following ? "Unfollow" : "Follow"}
            </button>
            <button
              className="bg-green-500 p-2 rounded-xl px-3 cursor-pointer"
              onClick={handleClick}
            >
              <i className="bx bx-send"></i>{" "}
            </button>
          </div>
        </div>
        <p className="text-white text-sm">{user.description}</p>
        <section className="flex items-center w-full gap-5 "></section>
      </div>

      <h3 className="px-10 text-2xl font-semibold text-blue-100">Posts</h3>

      <section className=" flex flex-col items-center gap-10 overflow-y-auto scroll-hidden px-4 pt-10 pb-20 border-t border-gray-600">
        {posts ? (
          posts.map((post) => (
            <Posts
              key={post.id}
              id={post.id}
              userId={user.id}
              name={user.name}
              avatar={user.avatar_url}
              postText={post.content}
              postImage={post.url}
              likes={post.likes}
            />
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </section>
      <div className="md:hidden">
        <NavigationBar />
      </div>
    </section>
  );
}

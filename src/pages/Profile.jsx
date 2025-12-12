import { useState } from "react";
import photo from "../assets/photo.jpg";
import photo2 from "../assets/photo2.jpg";
import photo3 from "../assets/photo3.jpg";
import { NavigationBar } from "../components/NavigationBar";
import { Posts } from "../components/Posts";
import FollowComponent from "../components/FollowComponent";
import ModalEditProfile from "../components/ModalEditProfile";
import useGetCurrentUser from "../hooks/useGetCurrentUser";
import useGetPosts from "../hooks/useGetPosts";
import useCreatePost from "../hooks/useCreatePost";

export function Profile() {
  const [showModalFollows, setShowModalFollows] = useState(false);
  const { currentUser, loading, error } = useGetCurrentUser();
  const { posts, refetch } = useGetPosts({ id: currentUser ? currentUser.id : null });
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState("");
  const { createPost, loadingPost, errorPost } = useCreatePost();
  console.log(posts);
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }
  console.log(currentUser);
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-400">
        Error loading user.
      </div>
    );
  }

  const handleNewPost = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
  };

  const handleSubmitPost = async () => {
  if (!comment && !image) return;

  const fileInput = document.querySelector("input[type='file']");
  const file = fileInput?.files?.[0] || null;

  const result = await createPost({
    content: comment,
    file,
  });

  if (result) {
    setComment("");
    setImage(null);

    await refetch();
  }
};


  return (
    <>
      <section className="bg-second">
        <div
          className="w-full h-40 bg-seven relative bg-cover bg-center"
          style={{ backgroundImage: `url(${currentUser.banner_url})` }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          <img
            src={currentUser.avatar_url}
            alt={`${currentUser.name} avatar`}
            className="rounded-full w-30 h-30 object-cover absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 border-4 border-[#131318]"
          />
        </div>

        <div className="w-full md:w-xl h-full md:h-[90vh] px-4 flex flex-col gap-5 mt-20">
          <div className="flex justify-between">
            <div>
              <p className="text-xl w-full ml-3 font-bold text-white">
                {currentUser["name"]}
              </p>
              <p className="text-[12px] ml-3 text-gray-400">
                <span>1000</span> Followers
              </p>
            </div>
            <ModalEditProfile
              photo={currentUser.avatar_url}
              name={currentUser.name}
              username={currentUser.username}
              pronouns={"he"}
              bio={
                "Desarrollador web y móvil | React, React Native, Node.js, MongoDB, SQL, HTML, CSS, JavaScript | Colombia"
              }
              gender={"male"}
            />
          </div>
          <p className="text-white text-sm">
            Desarrollador web y móvil | React, React Native, Node.js, MongoDB,
            SQL, HTML, CSS, JavaScript | Colombia
          </p>
          <section className="flex items-center w-full gap-5 "></section>

          <section className="w-full gap-5 p-2 rounded-sm flex flex-col bg-second text-white">
            <textarea
              placeholder="Write something..."
              className="w-full border-b border-gray-600 text-xl outline-0 resize-none placeholder:text-gray-400"
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {image && (
              <div className="relative w-full flex justify-center">
                <img
                  src={image}
                  alt="Preview"
                  className="max-h-60 rounded-md object-cover"
                />
                <button
                  className="bg-third text-lg px-3 py-1 hidden"
                  disabled={(!comment && !image) || loadingPost}
                  onClick={handleSubmitPost}
                >
                  {loadingPost ? "Posting..." : "Submit"}
                </button>
              </div>
            )}

            <div className="flex justify-between">
              <label
                htmlFor="upload-image"
                className="p-2 bg-third rounded-sm cursor-pointer inline-flex items-center gap-2 justify-between"
              >
                <i className="bx bx-image text-4xl" />
              </label>

              <input
                id="upload-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleNewPost}
              />

              <button
                className="bg-third text-lg px-3 py-1"
                disabled={!comment}
                onClick={handleSubmitPost}
              >
                Submit
              </button>
            </div>
          </section>
        </div>
        <h3 className="px-10 py-5 text-2xl font-semibold text-white">Posts</h3>
      </section>

      

      <section className=" flex flex-col items-center gap-10 overflow-y-auto scroll-hidden px-4 pt-10 pb-20 border-t border-gray-600">
        {posts ? (
          posts.map((post) => (
            <Posts
              key={post.id}
              id={post.id}
              currentUserId={currentUser.id}
              name={currentUser.name}
              avatar={currentUser.avatar_url}
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

      {showModalFollows && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-10">
          <div className="w-full h-80 bg-white dark:bg-neutral-900 rounded-3xl flex flex-col gap-2">
            <ul className="flex justify-between border-b border-gray-400 py-2 px-4 font-semibold text-lg h-10">
              <li className="px-2"></li>
              <li>Followers</li>
              <li onClick={() => setShowModalFollows(false)}>
                <i className="bx  bx-x text-black dark:text-white text-3xl cursor-pointer"></i>{" "}
              </li>
            </ul>
            <div className="p-2">
              <div className="w-full h-8 flex items-center gap-3 bg-gray-100 dark:bg-neutral-800 rounded-sm">
                <i class="bx  bx-search"></i>
                <input type="text" placeholder="Search" className="outline-0" />
              </div>
            </div>
            <section className=" overflow-y-auto ">
              <div className="flex flex-col gap-2">
                <FollowComponent photo={photo} />
                <FollowComponent photo={photo2} />
                <FollowComponent photo={photo3} />
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}

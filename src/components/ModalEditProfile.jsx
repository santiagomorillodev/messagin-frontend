import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ModalEditProfile({
  photo,
  banner,
  name,
  username,
  pronouns,
  bio,
  gender,
}) {
  const [showModalEditProfile, setShowModalEditProfile] = useState(false);

  const [avatar, setAvatar] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const navigate = useNavigate();

  const originalData = {
    name,
    username,
    pronouns,
    description: bio,
    gender,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const form = new FormData(e.target);

    let usernameChanged = false;

    // Campos de texto
    for (const [key, value] of form.entries()) {
      if (value && value !== originalData[key]) {
        formData.append(key, value);

        if (key === "username" && value !== username) {
          usernameChanged = true;
        }
      }
    }

    // Avatar
    if (avatar) {
      formData.append("avatar", avatar);
    }

    // Banner
    if (bannerImage) {
      formData.append("banner", bannerImage);
    }

    if ([...formData.entries()].length === 0) {
      alert("No hay cambios para guardar");
      return;
    }

    const res = await fetch("https://messagin-backend.onrender.com/update", {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      alert("Error al actualizar el usuario");
      return;
    }

    setShowModalEditProfile(false);

    if (usernameChanged) {
      navigate("/");
    }
  };

  return (
    <>
      <button
        className="py-1 px-5 bg-third text-white rounded-sm cursor-pointer"
        onClick={() => setShowModalEditProfile(true)}
      >
        Edit profile
      </button>

      {showModalEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-10">
          <div className="w-full md:w-xl h-[90%] bg-white dark:bg-neutral-900 rounded-xl flex flex-col gap-2 overflow-y-auto scroll-hidden">
            <ul className="flex justify-between pt-2 px-4 font-semibold text-lg">
              <li></li>
              <li>
                <i
                  onClick={() => setShowModalEditProfile(false)}
                  className="bx bx-x text-black dark:text-white text-3xl cursor-pointer"
                ></i>
              </li>
            </ul>

            <form onSubmit={handleSubmit} className="p-4">
              {/* Banner */}
              <div className="w-full relative mb-6">
                <img
                  src={bannerImage ? URL.createObjectURL(bannerImage) : banner}
                  className="w-full h-40 object-cover rounded-md"
                />

                <label
                  htmlFor="changeBannerInput"
                  className="absolute bottom-2 right-2 px-3 py-1 bg-black/50 text-white text-xs cursor-pointer rounded-md"
                >
                  Change banner
                </label>

                <input
                  type="file"
                  id="changeBannerInput"
                  className="hidden"
                  onChange={(e) => setBannerImage(e.target.files[0])}
                />
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center gap-2 mb-4">
                <img
                  src={avatar ? URL.createObjectURL(avatar) : photo}
                  className="w-24 h-24 rounded-full object-cover border-2 border-white -mt-12"
                />
                <label
                  htmlFor="changeAvatarInput"
                  className="text-blue-400 cursor-pointer"
                >
                  Change profile photo
                </label>
                <input
                  type="file"
                  id="changeAvatarInput"
                  className="hidden"
                  onChange={(e) => setAvatar(e.target.files[0])}
                />
              </div>

              {/* Campos */}
              <InputField name="name" label="Name" defaultValue={name} />

              <InputField
                name="username"
                label="Username"
                defaultValue={username}
              />

              <InputField
                name="pronouns"
                label="Pronouns"
                defaultValue={pronouns}
              />

              <InputField
                name="description"
                label="Description"
                defaultValue={bio}
              />

              <InputField name="gender" label="Gender" defaultValue={gender} />

              <button
                type="submit"
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function InputField({ name, label, defaultValue }) {
  return (
    <div className="m-4 px-4 py-1 border rounded-md">
      <label className="block text-sm text-gray-400">{label}</label>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        className="w-full p-0 bg-transparent outline-none text-sm"
      />
    </div>
  );
}

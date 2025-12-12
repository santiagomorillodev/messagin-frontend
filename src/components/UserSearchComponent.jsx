import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserSearchComponent({ id, photo = null, name = 'Loading...', username='', status=false, followerCount=0, onRemove, currentSearch =false,  }) {
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()


  const handleDelete = async () => {
    setError(null);

    try {
      const res = await fetch(`https://messagin-backend.onrender.com/recent/search/${id}`, {
        method: "DELETE",
        credentials: "include", // si tu backend usa cookies/sesión
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        if (typeof onRemove === "function") onRemove(id);
        setDeleting(true)
      } else {
        const text = await res.text();
        setError(`Error del servidor: ${res.status} ${text}`);
      }
    } catch (err) {
      setError(err.message || "Network error");
    }
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-second text-white border-b border-neutral-500">
      <div className="flex gap-3 items-center" onClick={() => navigate(`/profile`, {state: {id, name, photo, status, followerCount}})}>
        <img
          src={photo}
          alt={name || "user"}
          width="50"
          className="rounded-full min-w-[50px] h-[50px] object-cover"
        />
        <div>
          <p>{name || "Unknown"}</p>
          <p className="text-neutral-400 text-sm">{username}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {error && <span className="text-red-500 text-sm">{error}</span>}
        <button
          className={currentSearch ? "hidden" : "py-2 px-4 bg-red-500 rounded-3xl font-semibold"}
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Eliminando..." : "Suprimir"}
        </button>
      </div>
    </div>
  );
}
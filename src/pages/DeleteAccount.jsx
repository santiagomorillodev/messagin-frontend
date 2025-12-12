import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../components/NavigationBar";

export default function DeleteAccount() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formEmail = formData.get("email");
    const formPassword = formData.get("password");

    if (!formEmail || !formPassword) {
      alert("Por favor, complete todos los campos");
      return;
    }

    const deleteData = {
      email: formEmail,
      password: formPassword,
    };

    console.log("Enviando datos de eliminación:", deleteData);

    const res = await fetch("https://messagin-backend.onrender.com/delete/account", {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteData),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.detail || "Error al eliminar cuenta");
      return;
    }

    alert("Cuenta eliminada correctamente");
    navigate("/");
  };

  return (
    <>
      <nav>
        <ul className="flex justify-between items-center border-b border-neutral-600">
          <li className="flex items-center gap-2 md:invisible">
            <button onClick={() => navigate(-1)}>
              <i className="bx bx-chevron-left text-blue-400 text-4xl cursor-pointer"></i>
            </button>
          </li>
          <li><p className="font-bold text-xl">Delete account</p></li>
          <li><p className="p-2"></p></li>
        </ul>
      </nav>

      <main className="px-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 max-w-md mx-auto mt-8">
            <label className="flex flex-col ">
              <span className="mb-1 font-medium">Email</span>
              <input
                type="email"
                name="email"
                className="border border-neutral-600 rounded px-3 py-2"
                required
              />
            </label>
            <label className="flex flex-col ">
              <span className="mb-1 font-medium">Password</span>
              <input
                type="password"
                name="password"
                className="border border-neutral-600 rounded px-3 py-2"
                required
              />
            </label>

            <button
              type="submit"
              className="bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 mt-4"
            >
              Delete Account
            </button>
          </div>
        </form>

        <div className="max-w-md mx-auto mt-8 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-800 font-medium">
            ⚠ Esta acción es irreversible. Tu cuenta será eliminada permanentemente.
          </p>
        </div>
      </main>

      <div className="md:hidden">
        <NavigationBar />
      </div>
    </>
  );
}

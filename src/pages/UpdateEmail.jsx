import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../components/NavigationBar";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

export default function UpdateEmail() {
    const currentUser = useGetCurrentUser();
    const {email} = currentUser || {};

    const navigate = useNavigate()
    const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const updateData = {};

    if (email !== formData.get("newEmail")) {
      updateData["email"] = formData.get("newEmail");
    }

    if (Object.keys(updateData).length === 0) {
      alert("No hay cambios");
      return;
    }

    console.log("Enviando datos actualizados:", updateData);

    await fetch("https://messagin-backend.onrender.com/user/update", { // <-- tu endpoint real
      credentials: "include",
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    console.log("Perfil actualizado:", updateData);
    navigate('/');
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
                    <li>
                        <p className="font-bold text-xl">Update Email</p>
                    </li>
                    <li>
                        <p className="p-2"></p>
                    </li>
                </ul>
            </nav>

            <main className="px-4">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 max-w-md mx-auto mt-8">
                        <label className="flex flex-col ">
                            <span className="mb-1 font-medium">Current Password</span>
                            <input
                                type="password"
                                name="currentPassword"
                                className="border border-neutral-600 rounded px-3 py-2"
                                required
                                autoComplete="current-password"
                            />
                        </label>
                        <label className="flex flex-col ">
                            <span className="mb-1 font-medium">New Email</span>
                            <input
                                type="email"
                                name="newEmail"
                                className="border border-neutral-600 rounded px-3 py-2"
                                required
                                autoComplete="email"
                            />
                        </label>
                        <label className="flex flex-col ">
                            <span className="mb-1 font-medium">Repeat New Email</span>
                            <input
                                type="email"
                                name="repeatNewEmail"
                                className="border border-neutral-600 rounded px-3 py-2"
                                required
                                autoComplete="email"
                            />
                        </label>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 mt-4"
                        >
                            Update Email
                        </button>
                    </div>
                </form>

                <div className="max-w-md mx-auto mt-8 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                    <p className="text-yellow-800 font-medium">
                        Recuerda tu nuevo correo electrónico. Es importante guardarlo en un lugar seguro para evitar problemas de acceso en el futuro.
                    </p>
                </div>
            </main>

            <div className="md:hidden">
                <NavigationBar />
            </div>
        </>
    );
}

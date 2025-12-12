import googleIcon from "../assets/googleIcon.svg";
import githubIcon from "../assets/github.svg";
import facebookIcon from "../assets/facebook.svg";
import { Input } from "../components/Input";
import { useNavigate } from "react-router-dom";
import calcularEdad from "../utils/calcularEdad.js"

export function Register() {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();
    const formData = new FormData(e.target);
    const birthdate = formData.get("birthdate")
    const age = calcularEdad(birthdate);

    const data = {
      name:formData.get("fullName"),
      email:formData.get("email"),
      username:formData.get("username"),
      age:age,
      password:formData.get("password")
    }
    console.log(`${data.name}\n${data.email}\n${data.username}\n${data.password}\n${data.age}`);
    try {
      const response = await fetch('https://messagin-backend.onrender.com/register',{
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (response.ok){
        const data = await response.json()
        navigate('/')
      }else{
        console.log(response)
      }
    } catch (error) {
      console.error("Error al registrar");
    }
  };
  return (
    <section className="h-dvh w-full flex flex-col justify-center items-center gap-3.5 bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-[409.5px] min-w-[200px] text-black flex flex-col justify-between p-14"
      >
        <h1 className="text-2xl md:text-3xl text-center">Messaging app</h1>

        <section className="flex flex-col gap-3.5 my-3.5">
          <Input name="fullName" type="text" placeholder="Full name" />
          <Input name="email" type="email" placeholder="user@example.com" />
          <Input name="username" type="text" placeholder="username" />
          <Input name="birthdate" type="date" placeholder="Birthdate" />
          <Input name="password" type="password" placeholder="Password" />
        </section>

        <p className="text-left text-sm">Or continue with</p>

        <div className="flex justify-between my-3.5">
          <div className="bg-gray-50 p-3 md:p-7 w-[91.7px] h-[46.9px] flex justify-center items-center">
            <img src={googleIcon} alt="google icon" width={32} height={31} />
          </div>
          <div className="bg-gray-50 p-3 md:p-7 w-[91.7px] h-[46.9px] flex justify-center items-center">
            <img
              src={facebookIcon}
              alt="facebook icon"
              width={32}
              height={31}
            />
          </div>
          <div className="bg-gray-50 p-3 md:p-7 w-[91.7px] h-[46.9px] flex justify-center items-center">
            <img src={githubIcon} alt="github icon" width={32} height={31} />
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#0366FF] text-white w-full md:w-1/2 mx-auto mt-3.5  text-[0.98rem] py-3"
        >
          Register
        </button>
      </form>

      <section className="w-full max-w-[409.5px] bg-white flex justify-center items-center p-4">
        <p className="text-black text-[0.98rem] cursor-pointer">
          Ya tienes una cuenta?{" "}
          <span className="text-blue-900" onClick={() => navigate("/")}>
            Inicia sesión
          </span>
        </p>
      </section>
    </section>
  );
}

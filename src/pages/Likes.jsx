import NavSettings from "../components/NavSettings";
import { Posts } from "../components/Posts";
import photo from "../assets/photo.jpg";
import photo2 from "../assets/photo2.jpg";
import photo3 from "../assets/photo3.jpg";
import photo4 from "../assets/photo4.jpg";
import photo5 from "../assets/photo5.jpeg";
import photo6 from "../assets/photo6.jpg";
import photo7 from "../assets/photo7.jpg";
import photo8 from "../assets/photo8.jpg";
import photo9 from "../assets/photo9.jpg";
import photo10  from "../assets/photo10.jpg";
import photo11 from "../assets/photo11.jpg";
import photo12 from "../assets/photo12.jpg";
import photo13 from "../assets/photo13.jpg";
import { NavigationBar } from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";

export default function Likes() {
  const navigate = useNavigate()
  return (
    <section className="overflow-y-auto scroll-hidden md:transition-all md:duration-300">
      <header className='mb-4 md:hidden '>
        <ul className="flex justify-between items-center px-4 py-2 border-b border-neutral-600">
          <li><i className='bx  bx-chevron-left text-blue-400 text-4xl cursor-pointer md:invisible' onClick={() => navigate(-1)}></i></li>
          <li className='font-bold text-xl text-black dark:text-white'><p className='font-bold'>Likes</p></li>
          <li><NavSettings/></li>
        </ul>
      </header>

      <main className="grid grid-cols-3  gap-1 px-4 pb-20  ">
        <Posts imagePost={photo} />
        <Posts imagePost={photo2} />
        <Posts imagePost={photo3} />
        <Posts imagePost={photo4} />
        <Posts imagePost={photo5} />
        <Posts imagePost={photo6} />
        <Posts imagePost={photo7} />
        <Posts imagePost={photo8} />
        <Posts imagePost={photo9} />
        <Posts imagePost={photo10} />
        <Posts imagePost={photo11} />
        <Posts imagePost={photo12} />
        <Posts imagePost={photo13} />
      </main>
      <div className="md:invisible">

        <NavigationBar/>
      </div>
    </section>
  )
}
